<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GovernmentDepartmentController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
});

//Route::middleware(['auth:sanctum', 'isAdmin'])->group(function () {
    Route::get('/government-departments', [GovernmentDepartmentController::class, 'index']);
    Route::get('/government-departments/{id}', [GovernmentDepartmentController::class, 'show']);
    Route::post('/government-departments', [GovernmentDepartmentController::class, 'store']);
    Route::put('/government-departments/{id}', [GovernmentDepartmentController::class, 'update']);
//});


Route::prefix('users')->group(function () {
    Route::get('{user}', [UserController::class, 'show']);
    Route::get('{governmentDepartmentId}/government-department', [UserController::class, 'getUsersByGovernmentDepartment']);
    Route::post('', [UserController::class, 'store']);
    Route::put('{user}', [UserController::class, 'update']);
    Route::delete('{user}', [UserController::class, 'destroy']);
});

/* Route::get('/send-welcome-email', 'App\Http\Controllers\UserController@sendWelcomeEmail'); */
