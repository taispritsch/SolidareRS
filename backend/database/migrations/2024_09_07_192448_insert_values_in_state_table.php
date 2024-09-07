<?php

use App\Models\State;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $getStateIBGEAPI = file_get_contents('https://servicodados.ibge.gov.br/api/v1/localidades/estados');

        $getStateIBGEAPI = json_decode($getStateIBGEAPI);

        foreach ($getStateIBGEAPI as $state) {
            State::create([
                'name' => $state->nome,
                'abbreviation' => $state->sigla,
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {}
};
