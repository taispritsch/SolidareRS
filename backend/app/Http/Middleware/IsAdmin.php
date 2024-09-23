<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @return \Illuminate\Http\Response|Closure
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = explode('|', $request->bearerToken());
        $userId = DB::table('personal_access_tokens')
            ->where('token', hash('sha256', $token[1]))
            ->value('tokenable_id');

        $user = User::find($userId);
        
        if ($user && !$user->is_admin) {
            return response()->json(['message' => 'Acesso não autorizado'], 401);
        }

        return $next($request);
    }
}
