<?php

namespace App\Http\Controllers;

use App\Mail\WelcomeToSolidareEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class UserController extends Controller
{
    public function sendWelcomeEmail()
    {
        Mail::to('gabrielli.sartori@universo.univates.br')->send(new WelcomeToSolidareEmail());
    }
}
