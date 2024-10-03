<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DonationPlace extends Model
{
    protected $fillable = [
        'phone',
        'description',
        'accept_donation',
        'accept_volunteers',
        'government_department_id',
        'address_id'
    ];

    public function address()
    {
        return $this->belongsTo(Address::class);
    }

    public function governmentDepartment()
    {
        return $this->belongsTo(GovernmentDepartment::class);
    }
}
