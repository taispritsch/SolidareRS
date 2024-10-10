<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\DonationPlace;
use App\Models\Product;

class CategoryController extends Controller
{
    public function index()
    {
        return Category::whereNull('parent_id')
            ->orderBy('description', 'asc')
            ->get();
    }

    public function getProductsByCategory(Category $category, DonationPlace $donationPlace)
    {
        $donationProductsId = $donationPlace->donations->pluck('product_id')->toArray();

        $productId = $category->productHasCategories()
            ->whereHas('product', function ($query) use ($donationProductsId) {
                $query->whereNotIn('id', $donationProductsId);
            })
            ->select('product_id')
            ->get();

        $products = Product::whereIn('id', $productId)
            ->get();

        return $products;
    }
}
