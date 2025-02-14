<?php

namespace App\Imports;

use App\Models\ExcelFile;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Concerns\ToModel;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\WithCalculatedFormulas;

class ProjectsImport implements ToModel, WithCalculatedFormulas
{
    private $startData = false;
    private $isCode = false;
    private $projectId;
    private $governorateId;
    public function __construct($projectId, $governorateId)
    {
        $this->projectId = $projectId;
        $this->governorateId = $governorateId;
    }
    public function model(array $row)
    {
        $user = Auth::user();

        if (
            (strtolower($row[0]) == "shopname" && strtolower($row[1]) == "code" && strtolower($row[2]) == "region") ||
            (strtolower($row[0]) == "shopname" && strtolower($row[1]) == "region" && strtolower($row[2]) == "area")
        ) {
            if (strtolower($row[1]) == "code") {
                $this->isCode = true;
            }
            $this->startData = true;
        } elseif ($this->startData) {
            if ($this->isCode) {
                return new ExcelFile([
                    'project_id' => $this->projectId,
                    'governorate_id' => $this->governorateId,
                    'shopname' => $row[0],
                    'region' => $row[2],
                    'area' => $row[3],
                    'width' => $row[4],
                    'height' => $row[5],
                    'qty' => $row[6],
                    'item' => $row[7],
                    'sqm' => $row[8],
                    'status' => $row[9],
                    'notes' => $row[10],
                    'images' => null,
                    'editedBy' => $user->id ?? null,
                ]);
            } else {
                Log::info('Imported Row:', $row);
                return new ExcelFile([
                    'project_id' => $this->projectId,
                    'governorate_id' => $this->governorateId,
                    'shopname' => $row[0],
                    'region' => $row[1],
                    'area' => $row[2],
                    'width' => $row[3],
                    'height' => $row[4],
                    'qty' => $row[5],
                    'item' => $row[6],
                    'sqm' => $row[7],
                    'status' => $row[8],
                    'notes' => $row[9],
                    'images' => null,
                    'editedBy' => $user->id ?? null,
                ]);
            }
        }
    }
}