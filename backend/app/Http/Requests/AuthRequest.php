<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AuthRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'email' => 'required|email',
            'password' => [
                'required',
                'min:8',             // must be at least 8 characters in length
                'regex:/[a-z]/',      // must contain at least one lowercase letter
                'regex:/[A-Z]/',      // must contain at least one uppercase letter
                'regex:/[0-9]/',      // must contain at least one digit
                'regex:/[@$!%*#?&]/', // must contain a special character
            ],
        ];
    }

    public function messages()
    {
        return [
            'password.regex' => 'A senha deve conter pelo menos uma letra minúscula, uma letra maiúscula, um número e um caractere especial.',
            'password.min' => 'A senha deve conter pelo menos 8 caracteres.',
            'password.required' => 'A senha é obrigatória.',
            'email.required' => 'O e-mail é obrigatório.',
        ];
    }
}
