<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DonationItem extends Model
{
    protected $fillable = [
        'donation_id',
        'variantion_id',
        'urgent'
    ];

    public function donation()
    {
        return $this->belongsTo(Donation::class);
    }

    public function variantion()
    {
        return $this->belongsTo(Variation::class);
    }
}