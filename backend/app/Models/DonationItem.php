<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DonationItem extends Model
{
    protected $fillable = [
        'donation_id',
        'variation_id',
        'urgent'
    ];

    public function donation()
    {
        return $this->belongsTo(Donation::class);
    }

    public function variation()
    {
        return $this->belongsTo(Variation::class);
    }
}