<?php

namespace App\Http\Controllers;

use App\Http\Requests\BusinessHourRequest;
use App\Http\Requests\DonationPlaceRequest;
use App\Models\Address;
use App\Models\BusinessHour;
use App\Models\DonationPlace;
use App\Models\GovernmentDepartment;
use App\Services\CreateDefaultBusinessHoursService;
use App\Services\CreateDonationPlaceService;
use App\Services\CreateNewBusinessHoursService;
use App\Services\UpdateDonationPlaceService;
use Illuminate\Support\Facades\DB;

class DonationPlaceController extends Controller
{
    public function __construct(
        private CreateDonationPlaceService $createDonationPlaceService,
        private UpdateDonationPlaceService $updateDonationPlaceService,
        private CreateDefaultBusinessHoursService $createDefaultBusinessHoursService,
        private CreateNewBusinessHoursService $createNewBusinessHoursService
    ) {}

    public function getAllPlacesByGovernmentDepartment(GovernmentDepartment $governmentDepartment)
    {
        return DonationPlace::where('government_department_id', $governmentDepartment->id)->get();
    }

    public function show(DonationPlace $donationPlace)
    {
        logger('Listando local de doação.', ['local' => $donationPlace]);
        return $donationPlace->load('address.city');
    }

    public function getBusinessHours(DonationPlace $donationPlace)
    {
       $donation = $donationPlace->businessHours()->where('type', BusinessHour::DONATION_TYPE)->get();

        if ($donation) {
            $donation->each(function ($item) {
                $item->hours = json_decode($item->hours);
            });
        }

        $volunteer = $donationPlace->businessHours()->where('type', BusinessHour::VOLUNTEER_TYPE)->get();

        if ($volunteer) {
            $volunteer->each(function ($item) {
                $item->hours = json_decode($item->hours);
            });
        }

        return response()->json([
            'donation' => $donation,
            'volunteer' => $volunteer
        ]);
    }

    public function store(DonationPlaceRequest $request)
    {
        $inputs = $request->validated();

        DB::beginTransaction();
        try {
            $donationPlace = $this->createDonationPlaceService->handle($inputs);

            $this->createDefaultBusinessHoursService->handle($donationPlace);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 500);
        }

        return response()->json($donationPlace, 201);
    }

    public function update(DonationPlace $donationPlace, DonationPlaceRequest $request)
    {
        $inputs = $request->validated();

        DB::beginTransaction();
        try {
            $donationPlace = $this->updateDonationPlaceService->handle($donationPlace, $inputs);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 500);
        }

        return response()->json($donationPlace, 200);
    }

    public function updateBusinessHours(DonationPlace $donationPlace, BusinessHourRequest $request)
    {
        $inputs = $request->validated();

        DB::beginTransaction();
        try {
            $donationPlace->businessHours()->delete();

            $this->createNewBusinessHoursService->handle($donationPlace, $inputs);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 500);
        }

        return response()->json(['message' => 'Horários de funcionamento atualizados com sucesso'], 200);
    }

    public function destroy(DonationPlace $donationPlace)
    {
        DB::beginTransaction();

        try {
            $donationPlace->businessHours()->delete();
            $donationPlace->donations->each(function ($donation) {
                $donation->donationItems()->delete();
                $donation->delete();
            });
            $donationPlace->delete();
            Address::where('id', $donationPlace->address_id)->delete();

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 500);
        }

        return response()->json(['message' => 'Local deletado com sucesso'], 200);
    }
}
