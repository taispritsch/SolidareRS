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

    public function show($id)
    {
       $department = GovernmentDepartment::with('address.city')->find($id);

       if (!$department) {
          return response()->json(['message' => 'Órgão público não encontrado.'], 404);
       }

       return response()->json($department);
    }

    public function update(GovernmentDepartmentRequest $request, $id)
    {
        $inputs = $request->validated();

        DB::beginTransaction();
        try {
            $department = GovernmentDepartment::with('address')->find($id);
            if (!$department) {
                return response()->json(['message' => 'Órgão público não encontrado.'], 404);
            }

            $department = $this->createGovernmentDepartmentService->update($department, $inputs);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 500);
        }

        return response()->json($department, 200);
    }
}