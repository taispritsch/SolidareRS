<?php

namespace App\Http\Controllers;

use App\Http\Requests\DonationPlaceRequest;
use App\Models\DonationPlace;
use App\Models\GovernmentDepartment;
use App\Services\CreateDonationPlaceService;
use App\Services\UpdateDonationPlaceService;

class DonationPlaceController extends Controller
{
    public function __construct(
        private CreateDonationPlaceService $createDonationPlaceService,
        private UpdateDonationPlaceService $updateDonationPlaceService
    ) {}

    public function getAllPlacesByGovernmentDepartment(GovernmentDepartment $governmentDepartment)
    {
        return DonationPlace::where('government_department_id', $governmentDepartment->id)->get();
    }

    public function show(DonationPlace $donationPlace)
    {
        return $donationPlace->load('address.city');
    }

    public function store(DonationPlaceRequest $request)
    {
        $inputs = $request->validated();

        try {
            $donationPlace = $this->createDonationPlaceService->handle($inputs);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }

        return response()->json($donationPlace, 201);
    }

    public function update(DonationPlace $donationPlace, DonationPlaceRequest $request)
    {
        $inputs = $request->validated();

        try {
            $donationPlace = $this->updateDonationPlaceService->handle($donationPlace, $inputs);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }

        return response()->json($donationPlace, 200);
    }

    public function destroy(DonationPlace $donationPlace)
    {
        try {
            $donationPlace->delete();
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }

        return response()->json(['message' => 'Local deletado com sucesso'], 200);
    }
}
