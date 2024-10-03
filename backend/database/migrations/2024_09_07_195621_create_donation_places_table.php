<?php

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
        Schema::create('donation_places', function (Blueprint $table) {
            $table->id();
            $table->text('description');
            $table->string('phone')->nullable();
            $table->boolean('accept_donation');
            $table->boolean('accept_volunteers');
            $table->unsignedBigInteger('government_department_id');
            $table->foreign('government_department_id')->references('id')->on('government_departments');
            $table->unsignedBigInteger('address_id');
            $table->foreign('address_id')->references('id')->on('addresses');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donation_places');
    }
};
