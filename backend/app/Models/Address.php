<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Address extends Model
{
    protected $fillable = [
        'street',
        'number',
        'complement',
        'neighborhood',
        'zip_code',
        'city_id',
    ];

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function governmentDepartment(): HasOne
    {
        return $this->hasOne(GovernmentDepartment::class);
    }
}
