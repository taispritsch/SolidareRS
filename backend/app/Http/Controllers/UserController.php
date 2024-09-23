<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\GovernmentDepartment;
use App\Models\GovernmentDepartmentHasUsers;
use App\Models\User;
use App\Services\CreateUserService;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function __construct(private CreateUserService $createUserService) {}

    public function show(User $user)
    {
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($user, 200);
    }

    public function store(UserRequest $request)
    {
        $inputs = $request->validated();

        $inputs['password'] = env('USER_PASSWORD_DEFAULT');

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

    public function getUsersByGovernmentDepartment(GovernmentDepartment $governmentDepartment)
    {
        if (!$governmentDepartment) {
            return response()->json(['message' => 'Department not found'], 404);
        }

        $users = User::whereHas('governmentDepartmentHasUsers', function ($query) use ($governmentDepartment) {
            $query->where('government_department_id', $governmentDepartment->id);
        })->get();

        return response()->json($users, 200);
    }

    public function destroy(User $user)
    {
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        DB::beginTransaction();
        try {
            GovernmentDepartmentHasUsers::where('user_id', $user->id)->delete();

            $user->delete();

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 500);
        }

        return response()->json(['message' => 'User deleted'], 200);
    }

    public function update(UserRequest $request, User $user)
    {
        $inputs = $request->validated();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->update($inputs);

        return response()->json($user, 200);
    }
}
