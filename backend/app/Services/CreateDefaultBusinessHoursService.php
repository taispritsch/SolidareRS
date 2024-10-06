<?php

namespace App\Services;

use App\Models\BusinessHour;
use App\Models\DonationPlace;

class CreateDefaultBusinessHoursService
{
    public function handle(DonationPlace $donationPlace)
    {
        $daysOfWeek = BusinessHour::DAYS_OF_WEEK;

        if ($donationPlace->accept_donation) {
            foreach ($daysOfWeek as $dayOfWeek) {
                $donationPlace->businessHours()->create([
                    'day_of_week' => $dayOfWeek,
                    'hours' => json_encode([]),
                    'type' => BusinessHour::DONATION_TYPE
                ]);
            }
        }

        if ($donationPlace->accept_volunteers) {
            foreach ($daysOfWeek as $dayOfWeek) {
                $donationPlace->businessHours()->create([
                    'day_of_week' => $dayOfWeek,
                    'hours' => json_encode([]),
                    'type' => BusinessHour::VOLUNTEER_TYPE
                ]);
            }
        }
    }
}
