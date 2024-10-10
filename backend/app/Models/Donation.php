<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    protected $fillable = [
        'product_id',
        'donation_place_id',
        'urgent'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function donationPlace()
    {
        return $this->belongsTo(DonationPlace::class);
    }

    public function donationItems()
    {
        return $this->hasMany(DonationItem::class);
    }
}