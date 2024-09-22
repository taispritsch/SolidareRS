<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:5',
        ]);

        if (Auth::attempt($request->only('email', 'password'))) {
            $user = Auth::user();

            $userModal = User::find($user->id)->load('governmentDepartmentHasUsers.governmentDepartment');

            return response()->json([
                'message' => 'Login bem-sucedido.',
                'user' => $userModal,
            ]);
        }

        return response()->json(['message' => 'Credenciais inválidas.'], 401);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        return response()->json(['message' => 'Logout bem-sucedido.']);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:6|confirmed',
        ]);

        $user = Auth::user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'A senha atual está incorreta.'], 403);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json(['message' => 'Senha redefinida com sucesso.']);
    }

}
