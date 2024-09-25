<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Characteristic extends Model
{
    protected $fillable = [
        'description',
    ];

    public function variations()
    {
        return $this->hasMany(Variation::class);
    }
}
