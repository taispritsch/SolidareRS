<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BusinessHourRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'donation' => 'required|array',
            'donation.*.day_of_week' => 'required|string',
            'donation.*.hours' => 'nullable|array',
            'donation.*.type' => 'required|string|in:donation,volunteer',
            'volunteer' => 'required_without:donation|array',
            'volunteer.*.day_of_week' => 'required|string',
            'volunteer.*.hours' => 'nullable|array',
            'volunteer.*.type' => 'required|string|in:donation,volunteer'
        ];
    }
}