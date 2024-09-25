<?php

use App\Models\Characteristic;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Characteristic::create(['description' => 'Tamanho']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Characteristic::where('description', 'Tamanho')->delete();
    }
};
