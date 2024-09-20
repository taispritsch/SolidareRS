<?php

namespace App\Services;

use App\Mail\WelcomeToSolidareEmail;
use Illuminate\Support\Facades\Mail;

class SendWelcomeEmailService
{
    public function handle(string $email): void
    {
        Mail::to($email)->send(new WelcomeToSolidareEmail());
    }
}