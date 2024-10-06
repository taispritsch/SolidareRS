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

    public const DAYS_OF_WEEK = [
        'Segunda-feira',
        'Terça-feira',
        'Quarta-feira',
        'Quinta-feira',
        'Sexta-feira',
        'Sábado',
        'Domingo'
    ];

    protected $fillable = [
        'day_of_week',
        'hours',
        'type',
        'donation_place_id'
    ];

    public function donationPlace()
    {
        return $this->belongsTo(DonationPlace::class);
    }
}
