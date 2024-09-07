<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BusinessHour extends Model
{
    public const DONATION_TYPE = 'donation';
    public const VOLUNTEER_TYPE = 'volunteer';

    public const TYPES = [
        self::DONATION_TYPE,
        self::VOLUNTEER_TYPE
    ];

    protected $fillable = [
        'day_of_week',
        'open_time',
        'close_time',
        'type',
        'donation_place_id'
    ];

    public function donationPlace()
    {
        return $this->belongsTo(DonationPlace::class);
    }
}