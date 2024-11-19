<?php

namespace App\Http\Controllers;

use App\Http\Requests\VolunteerRequest;
use App\Models\GovernmentDepartment;
use App\Models\Volunteer;
use Illuminate\Support\Facades\DB;

class VolunteerController extends Controller
{
    public function index(GovernmentDepartment $governmentDepartment)
    {
        $volunteers = $governmentDepartment->volunteers;

        return response()->json($volunteers);
    }

    public function store(VolunteerRequest $request)
    {
        $validated = $request->validated();

        DB::beginTransaction();
        try {
            $volunteer = Volunteer::create([
                'name' => $validated['name'],
                'phone' => $validated['phone'],
                'government_department_id' => $validated['government_department_id'],
            ]);

            DB::commit();

            return response()->json($volunteer, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Erro ao salvar voluntário'], 500);
        }
    }
}
