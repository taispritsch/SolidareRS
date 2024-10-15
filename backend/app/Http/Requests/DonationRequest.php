<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DonationRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'donation_place_id' => 'required|integer|exists:donation_places,id',
            'products' => 'required|array',
            'products.*.id' => 'required|integer|exists:products,id', 
            'products.*.urgent' => 'required|boolean', 
        ];
    }
}