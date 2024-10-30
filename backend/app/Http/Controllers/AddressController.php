<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Address; 

class AddressController extends Controller
{
    public function show($id)
    {
        $address = Address::find($id);

        if (!$address) {
            return response()->json(['message' => 'Endereço não encontrado'], 404);
        }

        return response()->json($address);
    }
}
