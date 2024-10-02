<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GovernmentDepartmentController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CityController;
use App\Http\Controllers\DonationPlaceController;

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

Route::post('login', [AuthController::class, 'login']);
Route::post('reset-password', [AuthController::class, 'resetPassword']);

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::post('logout', [AuthController::class, 'logout']);

    Route::prefix('users')->group(function () {
        Route::get('{user}', [UserController::class, 'show']);
        Route::get('{governmentDepartment}/government-department', [UserController::class, 'getUsersByGovernmentDepartment']);
        Route::post('', [UserController::class, 'store']);
        Route::put('{user}', [UserController::class, 'update']);
        Route::delete('{user}', [UserController::class, 'destroy']);
    });

    Route::prefix('government-departments')->group(function () {
        Route::get('', [GovernmentDepartmentController::class, 'index'])->middleware('is.admin');
        Route::get('{governmentDepartment}', [GovernmentDepartmentController::class, 'show']);
        Route::post('', [GovernmentDepartmentController::class, 'store'])->middleware('is.admin');
        Route::put('{governmentDepartment}', [GovernmentDepartmentController::class, 'update']);
    });

    Route::prefix('donation-places')->group(function () {
        Route::get('{governmentDepartment}/government-department', [DonationPlaceController::class, 'getAllPlacesByGovernmentDepartment']);
        Route::get('{donationPlace}', [DonationPlaceController::class, 'show']);
        Route::post('', [DonationPlaceController::class, 'store']);
        Route::put('{donationPlace}', [DonationPlaceController::class, 'update']);
        Route::delete('{donationPlace}', [DonationPlaceController::class, 'destroy']);
    });

    Route::get('cities', [CityController::class, 'getCityByName']);
});
