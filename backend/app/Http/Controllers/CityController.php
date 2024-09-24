<?php

namespace App\Http\Controllers;

use App\Models\City;
use Illuminate\Http\Request;

class CityController extends Controller
{
    public function getCityByName(Request $request)
    {
        $name = $request->get('name');

        try {
            $city = City::where('name', $name)->whereHas('state', function ($query) {
                $query->where('name', 'Rio Grande do Sul');
            })->first();

            if (!$city) {
                return response()->json(['message' => 'City not found'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }

        return response()->json($city, 200);
    }
}
