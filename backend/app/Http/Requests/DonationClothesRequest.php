<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DonationClothesRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'donation_place_id' => 'required|integer|exists:donation_places,id',
            'variations' => 'required|array',
        ];
    }
}