<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GovernmentDepartmentHasUsers extends Model
{
    protected $fillable = [
        'government_department_id',
        'user_id',
    ];

    public function governmentDepartment()
    {
        return $this->belongsTo(GovernmentDepartment::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}