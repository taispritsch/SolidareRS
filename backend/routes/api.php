<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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


/* Route::get('/send-welcome-email', 'App\Http\Controllers\UserController@sendWelcomeEmail'); */

Route::post('/users', 'App\Http\Controllers\UserController@store');
Route::get('/users/{governmentDepartmentId}', 'App\Http\Controllers\UserController@getUsersByGovernmentDepartment');