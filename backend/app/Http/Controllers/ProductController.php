<?php

namespace App\Http\Controllers;

use App\Models\Donation;
use App\Models\DonationItem;
use App\Models\Product;
use App\Models\Variation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function getVariationsByProduct(Request $request)
    {
        $product_ids = $request->product_ids;
        $products = Product::whereIn('id', $product_ids)->with('variations')->get();

        return response()->json($products);
    }

    public function getRegisteredVariations(Request $request)
    {
        $productIds = $request->product_ids;

        $productsWithRegisteredVariations = Donation::whereIn('donations.product_id', $productIds)
            ->with(['donationItems', 'product', 'donationItems.variation'])
            ->get()
            ->pluck('donationItems');

        return response()->json($productsWithRegisteredVariations[0]);
    }

    public function getRegisteredUrgentVariations(Request $request)
    {
        $productIds = $request->product_ids;

        $productsWithRegisteredVariations = Donation::whereIn('donations.product_id', $productIds)
            ->leftJoin('donation_items', 'donations.id', '=', 'donation_items.donation_id')
            ->leftJoin('variations', 'donation_items.variation_id', '=', 'variations.id')
            ->where('donation_items.urgent', true)
            ->select('donation_items.*', 'variations.*')
            ->get()
            ->toArray();

        return response()->json($productsWithRegisteredVariations);
    }

    public function deleteVariation(DonationItem $donationItem)
    {
        DB::beginTransaction();
        try {
            $donation = Donation::find($donationItem->donation_id);

            $product = Product::find($donation->product_id);

            $donationItemsCount = $product->donations->sum(function ($donation) {
                return $donation->donationItems->count();
            });

            $donationItem->delete();

            if ($donationItemsCount === 1) {
                $donation->delete();
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }

        return response()->json(['message' => 'Variation deleted successfully']);
    }
}
