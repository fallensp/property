<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->foreignId('neighbourhood_id')
                ->nullable()
                ->after('property_unit_type_id')
                ->constrained('neighbourhoods')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->dropForeign(['neighbourhood_id']);
            $table->dropColumn('neighbourhood_id');
        });
    }
};
