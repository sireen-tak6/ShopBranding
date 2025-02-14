<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Governorate;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class GovernorateController extends Controller
{
    public function index()
    {
        try {
            $Governorates = Governorate::all();
            return response()->json([
                'status' => 200, 
                'governorates' => $Governorates,
            ], 200); 
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to fetch governorates',
                'error' => $e->getMessage(),
            ], 500); 
        }
    }
}