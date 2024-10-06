<?php

namespace App\Services;

use App\Models\BusinessHour;
use App\Models\DonationPlace;

class CreateNewBusinessHoursService
{
    public function handle(DonationPlace $donationPlace, array $inputs)
    {
        foreach ($inputs['donation'] as $input) {
            $donationPlace->businessHours()->create([
                'day_of_week' => $input['day_of_week'],
                'hours' => json_encode($input['hours']),
                'type' => BusinessHour::DONATION_TYPE
            ]);
        }

        foreach ($inputs['volunteer'] as $input) {
            $donationPlace->businessHours()->create([
                'day_of_week' => $input['day_of_week'],
                'hours' => json_encode($input['hours']),
                'type' => BusinessHour::VOLUNTEER_TYPE
            ]);
        }
    }
}