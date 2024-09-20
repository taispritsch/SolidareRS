<?php

namespace App\Services;

use App\Models\GovernmentDepartment;
use App\Models\User;

class CreateUserService
{
    public function __construct(private SendWelcomeEmailService $sendWelcomeEmailService) {}

    public function handle(array $inputs): User
    {
        $user = User::create($inputs);

        $governmentDepartment = GovernmentDepartment::find($inputs['government_department_id']);

        $user->governmentDepartmentHasUsers()->create([
            'government_department_id' => $governmentDepartment->id,
            'user_id' => $user->id,
        ]);

        $this->sendWelcomeEmailService->handle($user->email);

        return $user;
    }
}
