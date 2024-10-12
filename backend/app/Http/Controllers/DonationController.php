<?php

namespace App\Http\Controllers;

use App\Http\Requests\DonationClothesRequest;
use App\Http\Requests\DonationRequest;
use App\Models\Category;
use App\Models\Donation;
use App\Models\DonationItem;
use App\Models\DonationPlace;
use App\Models\Variation;
use Illuminate\Support\Facades\DB;

class DonationController extends Controller
{
    public function store(DonationRequest $request)
    {
        $input = $request->validated();

        DB::beginTransaction();
        try {
            foreach ($input['products'] as $product_id) {
                $donation = Donation::create([
                    'donation_place_id' => $input['donation_place_id'],
                    'product_id' => $product_id,
                ]);
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error on create donation'], 500);
        }

        return response()->json($donation, 201);
    }

    public function getCategoriesByDonationPlace(DonationPlace $donationPlace)
    {
        $categories = Donation::where('donation_place_id', $donationPlace->id)
            ->join('products', 'donations.product_id', '=', 'products.id')
            ->join('product_has_categories', 'products.id', '=', 'product_has_categories.product_id')
            ->join('categories', 'product_has_categories.category_id', '=', 'categories.id')
            ->select('categories.*')
            ->distinct()
            ->get();

            logger($categories);

        return $categories;
    }

    public function getProductsByCategoryByDonationPlace(DonationPlace $donationPlace, Category $category)
    {
        $products = Donation::where('donation_place_id', $donationPlace->id)
            ->join('products', 'donations.product_id', '=', 'products.id')
            ->join('product_has_categories', 'products.id', '=', 'product_has_categories.product_id')
            ->join('categories', 'product_has_categories.category_id', '=', 'categories.id')
            ->where('categories.id', $category->id)
            ->select('products.*', 'donations.id as donation_id')
            ->distinct()
            ->get();

        return $products;
    }

    public function destroy(Donation $donation)
    {
        try {
            $donation->delete();
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error on delete donation'], 500);
        }

        return response()->json(null, 204);
    }

    public function saveClothesDonation(DonationClothesRequest $request)
    {
        $inputs = $request->validated();

        logger($inputs);

        try {
            foreach ($inputs['variations'] as $variation) {
                $donation = Donation::create([
                    'donation_place_id' => $inputs['donation_place_id'],
                    'product_id' => $variation['product_id'],
                    'urgente' => false
                ]);

                
                foreach ($variation['variations'] as $size) {
                    $variation = Variation::find($size);
                    
                    DonationItem::create([
                        'donation_id' => $donation->id,
                        'variation_id' => $variation->id,
                        'urgent' => false
                    ]);
                }
            }
            
            
        } catch (\Exception $e) {
            logger($e->getMessage());
            return response()->json(['message' => 'Error on create donation'], 500);
        }

        return response()->json(201);
    }

}
