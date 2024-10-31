<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductHasCategory;
use App\Models\Variation;
use Illuminate\Support\Facades\DB;
use Throwable;

class CategoriesTableSeeder extends Seeder
{
    public function run()
    {

        DB::beginTransaction();
        try {
            $categories = file_get_contents(resource_path('json/addCategoriesAndProducts.json'));

            $categories = json_decode($categories, true);

            foreach ($categories as $category) {
                // Create the category
                $newCategory = Category::create([
                    'description' => array_keys($category)[0],
                ]);

                //Verify if next data is children
                if (array_keys(array_values($category)[0])[0] === 'children') {
                    // Create the subcategories
                    foreach ($category[array_keys($category)[0]] as $subcategory) {
                        foreach (array_keys($subcategory) as $key) {
                            //Create subcategory
                            $newSubcategory = Category::create([
                                'description' => $key,
                                'parent_id' => $newCategory->id
                            ]);

                            foreach ($subcategory[$key]['products'] as $product) {
                                $key = array_keys($product)[0];
                                $newProductWithSubcategory = Product::create([
                                    'description' => $key
                                ]);

                                ProductHasCategory::create([
                                    'product_id' => $newProductWithSubcategory->id,
                                    'category_id' => $newSubcategory->id
                                ]);

                                foreach ($product[$key] as $variation) {
                                    Variation::create([
                                        'description' => $variation,
                                        'characteristic_id' => 1,
                                        'product_id' => $newProductWithSubcategory->id
                                    ]);
                                }
                            }
                        }
                    }
                } else {
                    // Create Products and Product Has category
                    foreach ($category[array_keys($category)[0]]['products'] as $product) {
                        $newProduct = Product::create([
                            'description' => $product
                        ]);

                        ProductHasCategory::create([
                            'product_id' => $newProduct->id,
                            'category_id' => $newCategory->id
                        ]);
                    }
                }
            }

            DB::commit();
        } catch (Throwable $e) {
            DB::rollBack();
        }
    }
}
