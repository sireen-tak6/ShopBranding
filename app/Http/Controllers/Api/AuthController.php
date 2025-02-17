<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ChangePasswordRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Notification;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();
        if (!Auth::attempt($credentials)) {
            return response(['message' => 'Provided information is incorrect'], 422);
        }
        $user = Auth::user();
        $token = $user->createToken('main')->plainTextToken;
        $user->update(['fcm_token' => $request->fcm_token]);
        return response(compact('user', 'token'));

    }
    public function store(SignupRequest $request)
    {
        $data = $request->validated();
        $user = User::create([
            'username' => $data['username'],
            'phoneNumber' => $data['phoneNumber'],
            'password' => bcrypt($data['password']),
            'type' => $data['type'],
            'plainPassword' => $data['password'],
            'area'=> $data['area'],
        ]);
        $token = $user->createToken('main')->plainTextToken;
        return response(content: compact('user', 'token'));
    }
    public function logout(Request $request)
    {
        $user = $request->user();
        $user->fcm_token=null;
        $user->save();
        $user->currentAccessToken()->delete();
        return response('', 204);
    }
    public function index()
    {
        try {
            $users = UserResource::collection(User::query()->paginate(10));
            return response()->json([
                'status' => 200,
                'users' => $users,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to fetch users',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function show(User $user)
    {
        return new UserResource($user);

    }
    public function update(UserUpdateRequest $request, User $user)
    {
        $data = $request->validated();
        $data['plainPassword'] = $data['password'];
        if (isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        }
        $user->update($data);
        return new UserResource(resource: $user);
    }
    public function destroy(User $user)
    {

        $user->delete();
        return response('', 204);
    }
    public function updatePassword(ChangePasswordRequest $request)
    {
        $user = Auth::user();
        $data = $request->validated();
        $user['password'] = bcrypt($data['password']);
        $user['plainPassword'] = $data['password'];
        $user->save();

        return response()->json(['message' => 'Password updated successfully.']);
    }
    public function search(Request $request)
    {
        $query = $request->input('q');

        try {
            $users = User::where('phoneNumber', 'LIKE', "%$query%")->get();
            return response()->json([
                'status' => 200,
                'users' => $users,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to fetch users',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getNotifications()
    {
        // Get the authenticated user
        $user = Auth::user();

        // Fetch notifications for all users with related information and include the is_read status from the pivot table
        $notifications = Notification::whereHas('users', function ($query) use ($user) {
            $user // Filter by the authenticated user
                  ->where('notification_user.is_read', false)->orWhere('notification_user.is_read', true); // Filter by is_read = false in the pivot table
        })->with(['project', 'governorate', 'creator'])->orderByDesc('created_at')->get();

        // Map the result to include the necessary details, including the read status
        $notificationsData = $notifications->map(function ($notification) use ($user) {
            // Find the user's read status for this notification
            $readStatus = $notification->users->where('id', $user->id)->first()->pivot->is_read ?? false;

            return [
                'notification_id' => $notification->id,
                'message' => $notification->message,
                'project_name' => $notification->project->name,
                'project_code' => $notification->project->code,
                'project_id' => $notification->project->id,
                'governorate_name' => $notification->governorate->name,
                'governorate_id' => $notification->governorate->id,
                'user_phone_number' => $notification->creator->phoneNumber,
                'user_username' => $notification->creator->username,
                'is_read' => $readStatus,
                'created_at' => $notification->created_at,
            ];
        });
        $unreadCount = $user->notifications()->wherePivot('is_read', false)->count();

        return response()->json([
            'notifications' => $notificationsData,
            'unread_count' => $unreadCount,
        ]);
    }
    public function markAsRead($notificationId)
    {
        $user = Auth::user();

        // Check if the notification exists and belongs to the user
        $notification = $user->notifications()->find($notificationId);

        if ($notification) {
            // Mark the notification as read in the pivot table
            $notification->pivot->update(['is_read' => true]);
            return response()->json(['message' => 'Notification marked as read']);

        }

        return response()->json(['message' => 'Notification not found'], 404);
    }
    public function markAllAsRead()
    {
        $user = Auth::user();

        // Check if the notification exists and belongs to the user
        $notifications = $user->notifications()->get();
        if ($notifications) {

            foreach ($notifications as $notification) {
                // Mark the notification as read in the pivot table
                $notification->pivot->update(['is_read' => true]);

            }
            return response()->json(['message' => 'Notification marked as read']);
        }

        return response()->json(['message' => 'Notification not found'], 404);
    }


}