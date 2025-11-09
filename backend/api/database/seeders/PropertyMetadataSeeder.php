<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PropertyMetadataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $typesConfig = [
            [
                'name' => 'Bungalow / Villa',
                'category' => 'residential',
                'sub_types' => [
                    'Bungalow',
                    'Zero-Lot Bungalow',
                    'Link Bungalow',
                    'Bungalow Land',
                    'Twin Villas',
                ],
            ],
            [
                'name' => 'Apartment / Condo / Service Residence',
                'category' => 'residential',
                'sub_types' => [
                    'Flat',
                    'Apartment',
                    'Service Residence',
                    'Condominium',
                    'Loft',
                    'Soho',
                ],
            ],
            [
                'name' => 'Semi-Detached House',
                'category' => 'residential',
                'sub_types' => [
                    'Semi-Detached House',
                    'Cluster House',
                ],
            ],
            [
                'name' => 'Terrace / Link House',
                'category' => 'residential',
                'sub_types' => [
                    'Terraced House',
                    '1-storey Terraced House',
                    '1.5-storey Terraced House',
                    '2-storey Terrace House',
                    '2.5-storey Terraced House',
                    '3-storey Terraced House',
                    '3.5-storey Terraced House',
                    '4-storey Terraced House',
                    '4.5-storey Terraced House',
                    'Townhouse',
                ],
            ],
            [
                'name' => 'Residential Land',
                'category' => 'residential',
                'sub_types' => [
                    'Residential Land',
                ],
            ],
        ];

        $unitTypeBase = [
            'Intermediate',
            'Corner Lot',
            'End Lot',
            'Duplex',
            'Triplex',
            'Penthouse',
            'Studio',
            'Soho',
            'Loft',
            'Dual Key',
            'Prefer not to say',
        ];

        foreach ($typesConfig as $typeConfig) {
            $slug = Str::slug($typeConfig['name']);
            $typeId = DB::table('property_types')->where('slug', $slug)->value('id');

            if (! $typeId) {
                $typeId = DB::table('property_types')->insertGetId([
                    'name' => $typeConfig['name'],
                    'slug' => $slug,
                    'category' => $typeConfig['category'],
                    'description' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            } else {
                DB::table('property_types')
                    ->where('id', $typeId)
                    ->update([
                        'name' => $typeConfig['name'],
                        'category' => $typeConfig['category'],
                        'updated_at' => now(),
                    ]);
            }

            foreach ($typeConfig['sub_types'] as $subTypeName) {
                $subSlug = Str::slug($subTypeName);
                $subTypeId = DB::table('property_sub_types')
                    ->where('property_type_id', $typeId)
                    ->where('slug', $subSlug)
                    ->value('id');

                if (! $subTypeId) {
                    $subTypeId = DB::table('property_sub_types')->insertGetId([
                        'property_type_id' => $typeId,
                        'name' => $subTypeName,
                        'slug' => $subSlug,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                } else {
                    DB::table('property_sub_types')
                        ->where('id', $subTypeId)
                        ->update([
                            'name' => $subTypeName,
                            'updated_at' => now(),
                        ]);
                }

                foreach ($unitTypeBase as $unitTypeName) {
                    $unitSlug = Str::slug($unitTypeName);
                    $exists = DB::table('property_unit_types')
                        ->where('property_sub_type_id', $subTypeId)
                        ->where('slug', $unitSlug)
                        ->exists();

                    if (! $exists) {
                        DB::table('property_unit_types')->insert([
                            'property_type_id' => $typeId,
                            'property_sub_type_id' => $subTypeId,
                            'name' => $unitTypeName,
                            'slug' => $unitSlug,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    } else {
                        DB::table('property_unit_types')
                            ->where('property_sub_type_id', $subTypeId)
                            ->where('slug', $unitSlug)
                            ->update([
                                'name' => $unitTypeName,
                                'updated_at' => now(),
                            ]);
                    }
                }
            }
        }
    }
}
