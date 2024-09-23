<?php

namespace App\Services;

use App\Mail\SendResetPasswordEmail;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

class SendResetPasswordEmailService
{
    public function handle(User $user): void
    {
        Mail::to($user->email)->send(new SendResetPasswordEmail($user));
    }
}