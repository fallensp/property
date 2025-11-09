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
        Schema::create('property_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('category')->default('residential');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('property_sub_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_type_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->timestamps();

            $table->unique(['property_type_id', 'slug']);
        });

        Schema::create('property_unit_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_type_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('property_sub_type_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->timestamps();

            $table->unique(['property_sub_type_id', 'slug'], 'property_unit_subtype_slug_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('property_unit_types');
        Schema::dropIfExists('property_sub_types');
        Schema::dropIfExists('property_types');
    }
};
