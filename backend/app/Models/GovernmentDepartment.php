<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GovernmentDepartment extends Model
{
    protected $fillable = [
        'name',
        'address_id',
        'phone',
    ];

    public function address(): BelongsTo
    {
        return $this->belongsTo(Address::class);
    }

    public function governmentDepartmentHasUsers()
    {
        return $this->hasMany(GovernmentDepartmentHasUsers::class);
    }

    public function volunteers()
    {
        return $this->hasMany(Volunteer::class);
    }
}