<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GovernmentDepartmentRequest extends FormRequest
{
    public function authorize()
    {
        return true; 
    }

    public function rules()
    {
        return [
            'name' => 'required|string',
            'phone' => 'required|string',
            'street' => 'required|string',
            'neighborhood' => 'required|string',
            'number' => 'required|string',
            'zip_code' => 'required|string',
            'city_id' => 'required|integer',
        ];
    }
}
