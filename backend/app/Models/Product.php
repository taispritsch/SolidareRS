<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'description',
    ];

    public function productHasCategories()
    {
        return $this->hasMany(ProductHasCategory::class);
    }

    public function variations()
    {
        return $this->hasMany(Variation::class);
    }
}