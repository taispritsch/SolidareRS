<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function getVariationsByProduct (Request $request) {
        $product_ids = $request->product_ids;
        $products = Product::whereIn('id', $product_ids)->with('variations')->get();

        logger($products);

        return response()->json($products);
    }
}