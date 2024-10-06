<?php

namespace App\Services;

use App\Models\Address;
use App\Models\BusinessHour;
use App\Models\DonationPlace;

class UpdateDonationPlaceService
{
    public function handle(DonationPlace $donationPlace, array $inputs): DonationPlace
    {
        $daysOfWeek = BusinessHour::DAYS_OF_WEEK;

        if (! $inputs['accept_donation']) {
            $donationPlace->businessHours()->where('type', BusinessHour::DONATION_TYPE)->delete();
        }

        if (! $inputs['accept_volunteers']) {
            $donationPlace->businessHours()->where('type', BusinessHour::VOLUNTEER_TYPE)->delete();
        }

        if (! $donationPlace->accept_donation && $inputs['accept_donation']) {
            foreach ($daysOfWeek as $dayOfWeek) {
                $donationPlace->businessHours()->create([
                    'day_of_week' => $dayOfWeek,
                    'hours' => json_encode([]),
                    'type' => BusinessHour::DONATION_TYPE
                ]);
            }
        }

        if (! $donationPlace->accept_volunteers && $inputs['accept_volunteers']) {
            foreach ($daysOfWeek as $dayOfWeek) {
                $donationPlace->businessHours()->create([
                    'day_of_week' => $dayOfWeek,
                    'hours' => json_encode([]),
                    'type' => BusinessHour::VOLUNTEER_TYPE
                ]);
            }
        }
        
        $address = Address::find($donationPlace->address_id);

        $address->update($inputs);

        $donationPlace->update($inputs);

        return $donationPlace;
    }
}