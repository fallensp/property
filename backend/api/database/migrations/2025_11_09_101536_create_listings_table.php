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
        Schema::create('listings', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('agent_id')->constrained()->cascadeOnDelete();
            $table->foreignUlid('developer_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('property_type_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('property_sub_type_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('property_unit_type_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->string('reference_number')->nullable();
            $table->string('status')->default('draft');
            $table->string('listing_type')->default('sale');
            $table->string('category')->nullable();
            $table->string('price_currency', 3)->default('MYR');
            $table->unsignedBigInteger('price_value')->nullable();
            $table->string('price_display')->nullable();
            $table->string('price_type')->nullable();
            $table->date('available_from')->nullable();
            $table->string('tenure')->nullable();
            $table->string('completion_year')->nullable();
            $table->string('headline')->nullable();
            $table->text('description')->nullable();
            $table->boolean('has_video')->default(false);
            $table->boolean('has_virtual_tour')->default(false);
            $table->boolean('has_floorplan')->default(false);
            $table->jsonb('attributes')->nullable();
            $table->jsonb('metadata')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'listing_type']);
            $table->index('reference_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listings');
    }
};
