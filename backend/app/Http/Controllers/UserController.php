<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Mail\WelcomeToSolidareEmail;
use App\Models\GovernmentDepartment;
use App\Models\User;
use App\Services\CreateUserService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class UserController extends Controller
{
    public function __construct(private CreateUserService $createUserService) {}

    public function store(UserRequest $request)
    {
        $inputs = $request->validated();

        $inputs['password'] = '123456';

        DB::beginTransaction();
        try {
            $user = $this->createUserService->handle($inputs);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 500);
        }

        return response()->json($user, 201);
    }

    public function getUsersByGovernmentDepartment(int $governmentDepartmentId)
    {
        $governmentDepartment = GovernmentDepartment::find($governmentDepartmentId);

        if (!$governmentDepartment) {
            return response()->json(['message' => 'Department not found'], 404);
        }

        $users = User::whereHas('governmentDepartmentHasUsers', function ($query) use ($governmentDepartmentId) {
            $query->where('government_department_id', $governmentDepartmentId);
        })->get();

        return response()->json($users, 200);
    }



    /* public function sendWelcomeEmail(string $email)
    {
        Mail::to($email)->send(new WelcomeToSolidareEmail());
    } */
}
