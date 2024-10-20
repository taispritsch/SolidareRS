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

    public function getRegisteredVariations (Request $request) {
        $productIds = $request->product_ids;

        $productsWithRegisteredVariations = Product::whereIn('id', $productIds)
            ->with(['variations' => function ($query) {
                $query->join('donation_items', 'variations.id', '=', 'donation_items.variation_id');
            }])
            ->get();

        $result = $productsWithRegisteredVariations->map(function ($product) {
            return [
                'productId' => $product->id,
                'variations' => $product->variations->map(function ($variation) {
                    return [
                        'id' => $variation->id,
                        'name' => $variation->description,
                    ];
                })
            ];
        });

        return response()->json($result);

    }
}