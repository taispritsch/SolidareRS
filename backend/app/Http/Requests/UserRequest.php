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
}