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

    public function deleteVariation($product_id, $variation_id)
    {
        try {
            $product = Product::findOrFail($product_id);
            
            $variation = $product->variations()->where('id', $variation_id)->first();

            if (!$variation) {
                return response()->json(['error' => 'Variação não encontrada para este produto'], 404);
            }

            $variation->delete();

            return response()->json(['message' => 'Variação excluída com sucesso'], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Produto ou variação não encontrada'], 404);

        } catch (\Exception $e) {
            Log::error('Erro ao excluir a variação: ' . $e->getMessage());

            return response()->json(['error' => 'Erro ao excluir a variação'], 500);
        }
    }
}