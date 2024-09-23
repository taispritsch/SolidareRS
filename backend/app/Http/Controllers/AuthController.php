<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuthRequest;
use App\Models\User;
use App\Services\SendResetPasswordEmailService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function __construct(private SendResetPasswordEmailService $sendResetPasswordEmailService) {}

    public function login(AuthRequest $request)
    {
        $inputs = $request->validated();

        DB::beginTransaction();
        try {
            $user = User::where('email', $inputs['email'])->first();

            if (!$user || !Hash::check($inputs['password'], $user->password)) {
                return response()->json(['message' => 'Credenciais inválidas.'], 401);
            }

            DB::table('personal_access_tokens')->where('tokenable_id', $user->id)->delete();

            $expiresAt = now()->addMinutes(config('sanctum.expiration'));

            $token = $user->createToken('token', ['*'], $expiresAt)->plainTextToken;

            if (!$user->is_admin) {
                $user->load('governmentDepartmentHasUsers.governmentDepartment');
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Erro ao fazer login.'], 500);
        }

        return response()->json(['token' => $token, 'user' => $user]);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        return response()->json(['message' => 'Logout bem-sucedido.']);
    }

    public function resetPassword(AuthRequest $request)
    {
        $inputs = $request->validated();

        $user = User::where('email', $inputs['email'])->first();

        if (!$user) {
            return response()->json(['message' => 'Usuário não encontrado.'], 404);
        }

        DB::beginTransaction();
        try {
            $user->password = Hash::make($inputs['password']);
            $user->save();

            DB::table('personal_access_tokens')->where('tokenable_id', $user->id)->delete();

            $expiresAt = now()->addMinutes(config('sanctum.expiration'));

            $token = $user->createToken('token', ['*'], $expiresAt)->plainTextToken;

            $this->sendResetPasswordEmailService->handle($user);

            if (!$user->is_admin) {
                $user->load('governmentDepartmentHasUsers.governmentDepartment');
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Erro ao resetar a senha.'], 500);
        }

        return response()->json(['token' => $token, 'user' => $user]);
    }

    public function user(Request $request)
    {
        $token = explode('|', $request->bearerToken());
        $userId = DB::table('personal_access_tokens')
            ->where('token', hash('sha256', $token[1]))
            ->value('tokenable_id');

        $user = User::find($userId)->load('governmentDepartmentHasUsers.governmentDepartment');

        if ($user) {
            return response()->json([
                'user' => $user
            ], 200);
        }
        return response()->json([
            'message' => 'Usuário não encontrado',
        ], 404);
    }
}
