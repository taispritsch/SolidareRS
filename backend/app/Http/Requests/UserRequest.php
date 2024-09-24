<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, string>
     */
    public function rules()
    {
        switch ($this->method()) {
            case 'POST':
                return [
                    'name' => 'required|string',
                    'email' => 'required|email|unique:users,email',
                    'status' => 'required|in:active,inactive',
                    'government_department_id' => 'required|exists:government_departments,id',
                ];
            case 'PUT':
            case 'PATCH':
                return [
                    'name' => 'required|string',
                    'email' => 'required|email|unique:users,email,' . $this->user->id,
                    'status' => 'required|in:active,inactive',
                ];
            default:
                return [];
        }
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages()
    {
        return [
            'name.required' => 'O campo nome é obrigatório.',
            'name.string' => 'O campo nome deve ser uma string.',
            'email.required' => 'O campo e-mail é obrigatório.',
            'email.email' => 'O campo e-mail deve ser um e-mail válido.',
            'email.unique' => 'O e-mail informado já está em uso.',
            'status.required' => 'O campo status é obrigatório.',
            'status.in' => 'O campo status deve ser active ou inactive.',
            'government_department_id.required' => 'O campo departamento é obrigatório.',
            'government_department_id.exists' => 'O departamento informado não existe.',
        ];
    }
}