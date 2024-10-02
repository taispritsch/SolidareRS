<?php

namespace App\Http\Controllers;

use App\Http\Requests\DonationPlaceRequest;
use App\Models\DonationPlace;
use App\Models\GovernmentDepartment;
use App\Services\CreateDonationPlaceService;

class DonationPlaceController extends Controller
{
    public function __construct(private CreateDonationPlaceService $createDonationPlaceService) {}

    public function getAllPlacesByGovernmentDepartment(GovernmentDepartment $governmentDepartment)
    {
        logger($governmentDepartment);
        return DonationPlace::where('government_department_id', $governmentDepartment->id)->get();
    }

    public function show(DonationPlace $donationPlace)
    {
        return $donationPlace->load('address');
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

    public function update(DonationPlace $donationPlace)
    {
        //$donationPlace->update(request()->all());
        //return $donationPlace;
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
