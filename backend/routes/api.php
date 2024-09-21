<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GovernmentDepartmentController;
use App\Http\Controllers\UserController;

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

//Route::middleware(['auth:sanctum', 'isAdmin'])->group(function () {
    Route::get('/government-departments', [GovernmentDepartmentController::class, 'index']);
    Route::get('/government-departments/{id}', [GovernmentDepartmentController::class, 'show']);
    Route::post('/government-departments', [GovernmentDepartmentController::class, 'store']);
    Route::put('/government-departments/{id}', [GovernmentDepartmentController::class, 'update']);
//});

/* Route::get('/send-welcome-email', 'App\Http\Controllers\UserController@sendWelcomeEmail'); */

Route::post('/users', [UserController::class, 'store']);
Route::get('/users/{governmentDepartmentId}', [UserController::class, 'getUsersByGovernmentDepartment']);
