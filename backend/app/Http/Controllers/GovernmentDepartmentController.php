<?php

namespace App\Http\Controllers;

use App\Http\Requests\GovernmentDepartmentRequest;
use App\Services\CreateGovernmentDepartmentService;
use Illuminate\Http\Request;
use App\Models\GovernmentDepartment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class GovernmentDepartmentController extends Controller
{
    public function __construct(private CreateGovernmentDepartmentService $createGovernmentDepartmentService) {}

    public function index(Request $request)
    {

        $latitude = $request->query('lat');
        $longitude = $request->query('lon');

        if (!$latitude || !$longitude) {
            return response()->json(GovernmentDepartment::all());
        }

        $googleApiKey = env('GOOGLE_MAPS_API_KEY');

        $departments = GovernmentDepartment::all()->map(function ($department) use ($latitude, $longitude, $googleApiKey) {
            $endereco = $department->address->street . ', ' . $department->address->neighborhood . ', ' . $department->address->city . ', Brasil';

            $response = Http::get("https://maps.googleapis.com/maps/api/geocode/json", [
                'address' => $endereco,
                'key' => $googleApiKey,
            ]);

            if ($response->successful() && count($response->json()['results']) > 0) {
                $location = $response->json()['results'][0]['geometry']['location'];
                $department->latitude = $location['lat'];
                $department->longitude = $location['lng'];
                $department->distance = $this->calcularDistancia($latitude, $longitude, $location['lat'], $location['lng']);
            } else {
                $department->distance = PHP_INT_MAX; 
            }

            return $department;
        });

        $sortedDepartments = $departments->sortBy('distance')->values();

        return response()->json($sortedDepartments);
    }

    private function calcularDistancia($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371; 

        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
            cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
            sin($dLon / 2) * sin($dLon / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }



    public function store(GovernmentDepartmentRequest $request)
    {
        $inputs = $request->validated();

        DB::beginTransaction();
        try {
            $department = $this->createGovernmentDepartmentService->handle($inputs);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 500);
        }

        return response()->json($department, 201);
    }

    public function show(GovernmentDepartment $governmentDepartment)
    {
        if (!$governmentDepartment) {
            return response()->json(['message' => 'Órgão público não encontrado.'], 404);
        }

        return response()->json($governmentDepartment->load('address.city'));
    }

    public function update(GovernmentDepartmentRequest $request, GovernmentDepartment $governmentDepartment)
    {
        $inputs = $request->validated();

        DB::beginTransaction();
        try {
            $department = $this->createGovernmentDepartmentService->update($governmentDepartment, $inputs);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 500);
        }

        return response()->json($department, 200);
    }
}