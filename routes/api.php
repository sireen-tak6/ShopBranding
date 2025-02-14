<?php

use App\Http\Controllers\Api\GovernorateController;
use App\Http\Controllers\Api\ProjectController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


use App\Http\Controllers\Api\AuthController;
//use App\Http\Controllers\Api\UserController;



Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/users/search', [AuthController::class, 'search']);
    Route::apiResource(name: '/users', controller: AuthController::class)->only('show');
    Route::put('/user/profile/changePassword', [AuthController::class, 'updatePassword']);
    Route::get('/governorates', action: [GovernorateController::class, 'index']);
    Route::get('/projects', action: [ProjectController::class, 'index']);
    Route::get('/projects/{project}/governorates', action: [ProjectController::class, 'ProjectGovernorates']);
    Route::get('/projects/{project}/excel/{Governorate}', action: [ProjectController::class, 'show']);
    Route::get('/projects/{project}/{excelFile}', action: [ProjectController::class, 'ShowExcelRecord']);
    Route::post(uri: '/projects/{project}/{excelFile}', action: [ProjectController::class, 'update']);
    Route::get('/projects/search', [ProjectController::class, 'search']);
    Route::get('/notifications', [AuthController::class, 'getNotifications']);
    Route::post(uri: '/notifications/{notificationId}/mark-as-read', action: [AuthController::class, 'markAsRead']);
    Route::post(uri: '/notifications/mark-all-as-read', action: [AuthController::class, 'markAllAsRead']);


});
Route::middleware(['auth:sanctum', 'CheckUserType:Manager'])->group(function () {
    Route::apiResource(name: '/users', controller: AuthController::class)->except('show');
    Route::post('/newProject', action: [ProjectController::class, 'store']);
    Route::get('/export/{project}/{governorate}', [ProjectController::class, 'export']);
    Route::post('/approveproject/{project}', [ProjectController::class, 'markAsDone']);
    Route::post('/generate-pdf-data/{project}/{governorate}', [ProjectController::class, 'getPDFData']);

});
Route::post('/login', [AuthController::class, 'login']);