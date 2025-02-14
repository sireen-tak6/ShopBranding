<?php

namespace App\Http\Controllers\Api;

use App\Exports\ExcelFileExport;
use App\Http\Controllers\Controller;
use App\Http\Controllers\NotificationController;
use App\Http\Requests\ExcelRecordUpdateRequest;
use App\Http\Resources\ExcelResource;
use App\Imports\ProjectsImport;
use App\Models\Notification as CustomNotification;
use App\Models\User;
use App\Services\FirebaseService;
use Illuminate\Http\Request;
use App\Models\Project;
use App\Models\Governorate;
use App\Models\ExcelFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\Notification;
use Kreait\Laravel\Firebase\Facades\Firebase;
use Maatwebsite\Excel\Facades\Excel;
use Mpdf\Mpdf;
use Illuminate\Support\Facades\Log;

class ProjectController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:50',
            'code' => 'required|string|max:10|unique:projects,code',
            'governorates' => 'required|array|min:1',
            'governorates.*.id' => 'required|exists:governorates,id',
            'governorates.*.excel' => 'required|file|mimes:xlsx,xls,csv|max:2048',
        ]);

        // Create the project
        $project = Project::create([
            'name' => $request->name,
            'code' => $request->code,
        ]);
        // Handle governorates and Excel files
        foreach ($request->governorates as $govData) {
            Excel::import(new ProjectsImport($project->id, $govData['id']), $govData['excel']);
        }

        return response()->json(['message' => 'Project created successfully'], 201);
    }
    public function index()
    {
        try {
            $projects = Project::query()->orderBy('created_at', 'desc')->get();
            return response()->json([
                'status' => 200,
                'projects' => $projects,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to fetch projects',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function search(Request $request)
    {
        $query = $request->input('q');

        try {
            $projects = Project::where('code', 'LIKE', "%$query%")->orWhere('name', 'LIKE', "%$query%")->get();
            return response()->json([
                'status' => 200,
                'projects' => $projects,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to fetch projects',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,csv',
        ]);
        return redirect()->back()->with('success', 'Shops imported successfully!');
    }

    public function show(Project $project, $Governorate_id)
    {
        $data =
            $project->excelFiles()
                ->where('governorate_id', $Governorate_id)
                ->with('editor')
                ->get();
        $governoratesWithExcel = ExcelResource::collection($data);
        return response(content: compact(['project', 'governoratesWithExcel', 'Governorate_id']));
    }
    public function ProjectGovernorates(Project $project)
    {
        $governorates = Governorate::whereHas('excelFiles', function ($query) use ($project) {
            $query->where('project_id', $project->id);
        })->get();
        return response(content: compact('project', 'governorates'));
    }
    public function ShowExcelRecord(Project $project, $excel)
    {
        $data = ExcelFile::findOrFail($excel);
        return response(content: compact('data'));
    }
    public function update(ExcelRecordUpdateRequest $request, Project $project, ExcelFile $excelFile)
    {
        $data = $request->validated();
        foreach ($data as $key => $value) {
            if ($value === '') {
                $data[$key] = null;
            }
        }
        Log::info($data);
        if ($request->hasFile('images')) {
            $uploadedImages = [];
            foreach ($request->file('images') as $image) {
                $path = $image->store('excel_images', 'public'); // Store images in storage/app/public/excel_images
                $uploadedImages[] = $path;
            }
            $data['images'] = $uploadedImages;
        }
        $user = Auth::user();
        $excelFile->update($data);
        $governorateArea = $excelFile->governorate->area;
        $message = "تم تعديل المشروع '{$project->name}'-'{$project->code}' من قبل ('{$user->username}'-'{$user->phoneNumber}').";
        $users = User::where(function ($query) use ($governorateArea) {
            $query->whereIn('type', ['Manager', 'Agency']);
        })
            ->orWhere(function ($query) use ($governorateArea) {
                $query->where('type', 'Delegate')
                    ->where('area', $governorateArea);
            })
            ->whereNotNull('fcm_token')->get();
        // Create the notification
        $notification = CustomNotification::create([
            'project_id' => $project->id,
            'governorate_id' => $excelFile->governorate->id,
            'user_id' => Auth::id(), // the user who made the update
            'message' => $message
        ]);
        foreach ($users as $user) {

            // Attach the notification to each user with the 'is_read' flag set to false by default
            $user->notifications()->attach($notification->id, ['is_read' => false]);
        }
        // Send notification to each user
        foreach ($users as $user) {
            $this->sendFirebaseNotification($user->fcm_token, 'تعديل على مشروع', "تم تعديل المشروع '{$project->name}'-'{$project->code}' من قبل ('{$user->username}'-'{$user->phoneNumber}')-('{$user->username}'.");
        }
        \Log::info("Project updated and notification sent.");

        return response(content: compact('data'));
    }

    private function sendFirebaseNotification($deviceToken, $title, $body)
    {
        $messaging = Firebase::messaging();
        $message = CloudMessage::withTarget('token', $deviceToken)
            ->withNotification(Notification::create($title, $body));
        Log::info($deviceToken);

        try {
            $res = $messaging->send($message);
            Log::info($res);
        } catch (\Exception $e) {
            \Log::error(message: 'Failed to send notification: ' . $e->getMessage());
        }
    }


    public function export(Project $project, Governorate $governorate)
    {
        return Excel::download(new ExcelFileExport($governorate->id, $project->id), 'data.xlsx', \Maatwebsite\Excel\Excel::XLSX);
    }
    public function markAsDone(Project $project)
    {
        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }
        $project->status = 'Done';
        $project->save();
        return response(content: compact(['project']));
    }
    public function getPDFData(Project $project, Governorate $governorate)
    {
        $records = ExcelFile::where('project_id', $project->id)
            ->where('governorate_id', $governorate->id)
            ->orderBy('shopname')
            ->get()
            ->groupBy('shopname');

        // Generate image URLs
        $data = [];
        foreach ($records as $shopname => $group) {
            $shopData = [
                'shopname' => $shopname,
                'records' => [],
                'images' => [],
            ];

            foreach ($group as $record) {
                $shopData['records'][] = [
                    'region' => $record->region,
                    'area' => $record->area,
                    'width' => $record->width,
                    'height' => $record->height,
                    'qty' => $record->qty,
                    'item' => $record->item,
                    'status' => $record->status,
                    'notes' => $record->notes,
                ];

                // Assuming images are stored in `storage/app/public/excel_images`
                if ($record->images) {
                    $images = is_string($record->images)
                        ? json_decode($record->images, true)
                        : (is_array($record->images) ? $record->images : []);

                    if (is_array($images)) {
                        foreach ($images as $image) {
                            $shopData['images'][] = Storage::url($image);
                        }
                    }
                }
            }

            $data[] = $shopData;
        }

        return response()->json($data);
    }

}