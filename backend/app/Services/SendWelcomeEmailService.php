<?php

namespace App\Services;

use App\Mail\WelcomeToSolidareEmail;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

class SendWelcomeEmailService
{
    public function handle(User $user): void
    {
        Mail::to($user->email)->send(new WelcomeToSolidareEmail($user));
    }
}