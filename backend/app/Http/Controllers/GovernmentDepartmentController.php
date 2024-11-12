<?php

namespace App\Http\Controllers;

use App\Http\Requests\GovernmentDepartmentRequest;
use App\Services\CreateGovernmentDepartmentService;
use Illuminate\Http\Request;
use App\Models\GovernmentDepartment;
use Illuminate\Support\Facades\DB;

class GovernmentDepartmentController extends Controller
{
    public function __construct(private CreateGovernmentDepartmentService $createGovernmentDepartmentService) {}

    public function index()
    {
        $departments = GovernmentDepartment::all();

        logger('Listando todos os órgãos públicos.');
        return response()->json($departments);
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