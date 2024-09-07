<?php

use App\Models\City;
use App\Models\State;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $states = State::all();

        foreach ($states as $state) {
            $stateAbreviation = $state->abbreviation;

            $getCitiesIBGEAPI = file_get_contents("https://servicodados.ibge.gov.br/api/v1/localidades/estados/{$stateAbreviation}/municipios");

            $getCitiesIBGEAPI = json_decode($getCitiesIBGEAPI);

            foreach ($getCitiesIBGEAPI as $city) {
                City::create([
                    'name' => $city->nome,
                    'state_id' => $state->id,
                ]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {}
};
