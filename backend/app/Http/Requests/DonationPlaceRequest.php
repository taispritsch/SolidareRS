<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DonationPlaceRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'description' => 'required|string',
            'accept_donation' => 'required|boolean',
            'accept_volunteers' => 'required|boolean',
            'government_department_id' => 'required|integer',
            'street' => 'required|string',
            'neighborhood' => 'required|string',
            'number' => 'required|string',
            'zip_code' => 'required|string',
            'city_id' => 'required|integer',
        ];
    }
}