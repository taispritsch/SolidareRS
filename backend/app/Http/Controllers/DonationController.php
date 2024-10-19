<?php

namespace App\Http\Controllers;

use App\Http\Requests\DonationClothesRequest;
use App\Http\Requests\DonationRequest;
use App\Models\Category;
use App\Models\Donation;
use App\Models\DonationItem;
use App\Models\DonationPlace;
use App\Models\Variation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DonationController extends Controller
{
    public function store(DonationRequest $request)
    {
        $input = $request->validated();

        DB::beginTransaction();
        try {
            $donations = [];
            foreach ($input['products'] as $product) {
                $donation = Donation::create([
                    'donation_place_id' => $input['donation_place_id'],
                    'product_id' => $product['id'],
                    'urgent' => $product['urgent'],
                ]);
                $donations[] = $donation;
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error on create donation', 'error' => $e->getMessage()], 500);
        }

        return response()->json($donations, 201);
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

    public function getUrgentDonations()
    {
        $urgentDonations = Donation::where('urgent', true)
            ->with(['product', 'donationPlace'])
            ->join('products', 'donations.product_id', '=', 'products.id')
            ->join('product_has_categories', 'products.id', '=', 'product_has_categories.product_id')
            ->join('categories', 'product_has_categories.category_id', '=', 'categories.id')
            ->select('donations.*', 'products.description as product_description', 'categories.description as category_description')
            ->get();

        return response()->json($urgentDonations);
    }

    public function removeUrgency(Donation $donation)
    {
        try {
            $donation->urgent = false;
            $donation->save();
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error on updating urgency', 'error' => $e->getMessage()], 500);
        }

        return response()->json(['message' => 'Urgency removed successfully']);
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
            foreach ($inputs['variations'] as $product) {
                $hasUrgentVariation = false;

                foreach ($product['variations'] as $variation) {
                    if (isset($variation['urgency']) && $variation['urgency'] === true) {
                        $hasUrgentVariation = true;
                        break; // Se encontrarmos uma variação urgente, podemos parar a busca
                    }
                }

                $donation = Donation::create([
                    'donation_place_id' => $inputs['donation_place_id'],
                    'product_id' => $product['product_id'],
                    'urgent' => $hasUrgentVariation
                ]);

                foreach ($product['variations'] as $size) {
                    $variation = Variation::find($size['id']);

                    DonationItem::create([
                        'donation_id' => $donation->id,
                        'variation_id' => $variation->id,
                        'urgent' => $size['urgency']
                    ]);
                }
            }
        } catch (\Exception $e) {
            logger($e->getMessage());
            return response()->json(['message' => 'Error on create donation'], 500);
        }

        return response()->json(201);
    }

    public function getProductsByDonationPlace(DonationPlace $donationPlace, Request $request)
    {
        $inputs = $request->all();

        logger($inputs);

        $products = Donation::where('donation_place_id', $donationPlace->id)
            ->join('products', 'donations.product_id', '=', 'products.id')
            ->select('products.*', 'donations.id as donation_id')
            ->distinct();

        if (isset($inputs['category_id'])) {
            $products = $products->join('product_has_categories', 'products.id', '=', 'product_has_categories.product_id')
                ->where('product_has_categories.category_id', $inputs['category_id']);
        }

        return $products->get();
    }
}
