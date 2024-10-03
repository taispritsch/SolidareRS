<?php

namespace App\Services;

use App\Models\Address;
use App\Models\DonationPlace;

class UpdateDonationPlaceService
{
    public function handle(DonationPlace $donationPlace, array $inputs): DonationPlace
    {
        $address = Address::find($donationPlace->address_id);

        $address->update($inputs);

        $donationPlace->update($inputs);

        return $donationPlace;
    }
}