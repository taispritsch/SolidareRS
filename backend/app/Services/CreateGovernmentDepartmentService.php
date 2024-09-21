<?php

namespace App\Services;

use App\Models\GovernmentDepartment;
use App\Models\Address; 

class CreateGovernmentDepartmentService
{
    public function handle(array $inputs): GovernmentDepartment
    {
        $address = Address::create([
            'street' => $inputs['street'],
            'neighborhood' => $inputs['neighborhood'],
            'number' => $inputs['number'],
            'zip_code' => $inputs['zip_code'],
            'city_id' => $inputs['city_id'],
        ]);

        $department = GovernmentDepartment::create([
            'name' => $inputs['name'],
            'phone' => $inputs['phone'],
            'address_id' => $address->id, 
        ]);

        return $department;
    }
}
