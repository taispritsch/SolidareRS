<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Volunteer extends Model
{
    protected $fillable = [
        'name',
        'phone',
        'government_department_id',
    ];

    public function governmentDepartment(): HasOne
    {
        return $this->hasOne(GovernmentDepartment::class);
    }
}
