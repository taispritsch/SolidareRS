<?php

namespace App\Services;

use App\Models\Address;
use App\Models\DonationPlace;

class CreateDonationPlaceService
{
    public function handle(array $inputs): DonationPlace
    {
        $address = Address::create($inputs);

        $inputs['address_id'] = $address->id;

        $donationPlace = DonationPlace::create($inputs);

        return $donationPlace;
    }
}