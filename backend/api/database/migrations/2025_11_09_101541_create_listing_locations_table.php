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
        Schema::create('listing_locations', function (Blueprint $table) {
            $table->id();
            $table->foreignUlid('listing_id')->constrained('listings')->cascadeOnDelete();
            $table->string('development_name')->nullable();
            $table->string('address_line1')->nullable();
            $table->string('address_line2')->nullable();
            $table->string('street')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('country')->default('Malaysia');
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->boolean('is_bumi_lot')->default(false);
            $table->string('title_type')->nullable();
            $table->string('tenure')->nullable();
            $table->string('google_place_id')->nullable();
            $table->string('google_plus_code')->nullable();
            $table->string('google_formatted_address')->nullable();
            $table->jsonb('google_metadata')->nullable();
            $table->timestamps();

            $table->index(['city', 'state']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listing_locations');
    }
};
