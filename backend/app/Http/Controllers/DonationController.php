<?php

namespace App\Http\Controllers;

use App\Http\Requests\DonationClothesRequest;
use App\Http\Requests\DonationRequest;
use App\Models\Category;
use App\Models\Donation;
use App\Models\DonationItem;
use App\Models\DonationPlace;
use App\Models\Product;
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

    public function getUrgentDonations(Request $request)
    {
        $inputs = $request->all();

        $category = $inputs['category_id'] ?? null;

        $urgentDonations = Donation::where('urgent', true)
            ->with(['product', 'donationPlace'])
            ->join('products', 'donations.product_id', '=', 'products.id')
            ->join('product_has_categories', 'products.id', '=', 'product_has_categories.product_id')
            ->join('categories as category', 'product_has_categories.category_id', '=', 'category.id')
            ->leftJoin('categories as parent_category', 'category.parent_id', '=', 'parent_category.id')
            ->select(
                'donations.*',
                'products.description as product_description',
                'category.description as subcategory_description',
                'parent_category.description as parent_category_description'
            );

        if (isset($category)) {
            $category = Category::find($category);

            if ($category->description === 'Roupas e calçados') {
                $categoriesByParentId = Category::where('parent_id', $category->id)->get();
                $urgentDonations = $urgentDonations->whereIn('product_has_categories.category_id', $categoriesByParentId->pluck('id'));
            } else {
                $urgentDonations = $urgentDonations->where('product_has_categories.category_id', $category->id);
            }
        }

        return response()->json($urgentDonations->get());
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

    public function saveClothesDonation(DonationClothesRequest $request)
    {
        $inputs = $request->validated();

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
            return response()->json(['message' => 'Error on create donation'], 500);
        }

        return response()->json(201);
    }

    public function getAllProducts(Request $request)
    {
        $inputs = $request->all();
        $category = $inputs['category_id'] ?? null;

        $products = Donation::join('products', 'donations.product_id', '=', 'products.id')
            ->join('product_has_categories', 'products.id', '=', 'product_has_categories.product_id')
            ->join('categories as subcategory', 'product_has_categories.category_id', '=', 'subcategory.id')
            ->leftJoin('categories as parent_category', 'subcategory.parent_id', '=', 'parent_category.id')
            ->select(
                'products.*',
                'donations.id as donation_id',
                'subcategory.description as subcategory_description',
                'parent_category.description as parent_category_description'
            )
            ->distinct();

        if (isset($category)) {
            $category = Category::find($category);

            if ($category->description === 'Roupas e calçados') {
                $categoriesByParentId = Category::where('parent_id', $category->id)->get();
                $products = $products->whereIn('product_has_categories.category_id', $categoriesByParentId->pluck('id'));
            } else {
                $products = $products->where('product_has_categories.category_id', $category->id);
            }
        }

        return $products->get()->map(function ($product) {
            $product->category_description = $product->parent_category_description ?? $product->subcategory_description;
            return $product;
        });
    }

    public function getProductsByDonationPlace(DonationPlace $donationPlace, Request $request)
    {
        $inputs = $request->all();

        $category = $inputs['category_id'] ?? null;

        $products = Donation::where('donation_place_id', $donationPlace->id)
            ->join('products', 'donations.product_id', '=', 'products.id')
            ->join('product_has_categories', 'products.id', '=', 'product_has_categories.product_id')
            ->join('categories as subcategory', 'product_has_categories.category_id', '=', 'subcategory.id')
            ->leftJoin('categories as parent_category', 'subcategory.parent_id', '=', 'parent_category.id')
            ->select(
                'products.*',
                'donations.id as donation_id',
                'donations.urgent as urgent',
                'subcategory.description as subcategory_description',
                'parent_category.description as parent_category_description'
            )
            ->distinct();

        if (isset($category)) {
            $category = Category::find($category);

            if ($category->description === 'Roupas e calçados') {
                $categoriesByParentId = Category::where('parent_id', $category->id)->get();
                $products = $products->whereIn('product_has_categories.category_id', $categoriesByParentId->pluck('id'));
            } else {
                $products = $products->where('product_has_categories.category_id', $category->id);
            }
        }

        return $products->get()->map(function ($product) {
            $product->category_description = $product->parent_category_description ?? $product->subcategory_description;
            return $product;
        });
    }

    public function updateUrgencyClothes(Request $request)
    {
        $variations = $request->all();

        DB::beginTransaction();
        try {
            foreach ($variations as $variation) {
                $donationItem = DonationItem::find($variation['id']);
                $donationItem->urgent = $variation['urgent'];
                $donationItem->save();
            }
            
            $donation = Donation::where('product_id', $variations[0]['product_id'])->first();

            $allDonationItemsAreNotUrgent = $donation->donationItems()->where('urgent', true)->count() === 0;

            if ($allDonationItemsAreNotUrgent) {
                $donation->urgent = false;
                $donation->save();
            } else {
                $donation->urgent = true;
                $donation->save();
            }
            
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error on updating urgency', 'error' => $e->getMessage()], 500);
        }

        return response()->json(['message' => 'Urgency updated successfully'], 200);
    }

    public function updateUrgency(Request $request)
    {
        $inputs = $request->all();
        DB::beginTransaction();
        try {
            foreach ($inputs as $donationInput) {
                $donation = Donation::find($donationInput['id']);

                $donation->urgent = $donationInput['urgent'] ?? false;
                $donation->save();

                logger($donation);
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error on updating urgency', 'error' => $e->getMessage()], 500);
        }

        return response()->json(['message' => 'Urgency updated successfully'], 200);
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
}
