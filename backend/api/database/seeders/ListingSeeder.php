<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ListingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $agents = DB::table('agents')->pluck('id', 'email');
        $developers = DB::table('developers')->pluck('id', 'slug');
        $propertyTypes = DB::table('property_types')->pluck('id', 'name');
        $propertySubTypes = DB::table('property_sub_types')->pluck('id', 'name');
        $propertyUnitTypes = DB::table('property_unit_types')->pluck('id', 'name');

        $listings = [
            [
                'reference_number' => 'IPP500273554',
                'title' => 'Glenmarie Gardens',
                'status' => 'online',
                'listing_type' => 'sale',
                'category' => 'residential',
                'price_value' => 6000000,
                'price_display' => 'RM 6,000,000',
                'price_type' => 'fixed',
                'tenure' => 'Freehold',
                'completion_year' => '2018',
                'headline' => 'Resort-style living with landscaped gardens',
                'description' => 'Meticulously renovated villa balancing open entertaining spaces with private bedroom wings overlooking a sculpted courtyard pool.',
                'has_video' => true,
                'has_virtual_tour' => true,
                'has_floorplan' => true,
                'attributes' => [
                    'built_up_sqft' => 6355,
                    'land_area_sqft' => 8900,
                    'bedrooms' => 6,
                    'bathrooms' => 8,
                    'parking' => 6,
                    'furnishing' => 'Fully furnished',
                ],
                'metadata' => [
                    'listing_purpose' => 'sale',
                    'availability_mode' => 'immediate',
                ],
                'agent_email' => 'ainsley.foo@example.com',
                'developer_slug' => 'glenmarie-development-sdn-bhd',
                'property_type' => 'Bungalow / Villa',
                'property_sub_type' => 'Zero-Lot Bungalow',
                'property_unit_type' => 'Corner Lot',
                'location' => [
                    'development_name' => 'Glenmarie Gardens',
                    'address_line1' => 'Jalan Rektor U1/7',
                    'city' => 'Shah Alam',
                    'state' => 'Selangor',
                    'postal_code' => '40150',
                    'country' => 'Malaysia',
                    'latitude' => 3.0667,
                    'longitude' => 101.5333,
                    'street' => 'Saujana',
                    'title_type' => 'Individual',
                    'tenure' => 'Freehold',
                    'is_bumi_lot' => false,
                ],
            ],
            [
                'reference_number' => 'IPP500268477',
                'title' => 'USJ 5 Residence',
                'status' => 'online',
                'listing_type' => 'sale',
                'category' => 'residential',
                'price_value' => 2150000,
                'price_display' => 'RM 2,150,000',
                'price_type' => 'negotiable',
                'tenure' => 'Freehold',
                'completion_year' => '2012',
                'headline' => 'Extended terrace with indoor-outdoor living flow',
                'description' => 'Upgraded terrace with spacious open-plan ground floor and landscaped backyard that doubles as an al fresco studio.',
                'has_video' => false,
                'has_virtual_tour' => false,
                'has_floorplan' => true,
                'attributes' => [
                    'built_up_sqft' => 3400,
                    'land_area_sqft' => 2520,
                    'bedrooms' => 4,
                    'bathrooms' => 3,
                    'parking' => 2,
                    'furnishing' => 'Partially furnished',
                ],
                'metadata' => [
                    'listing_purpose' => 'sale',
                    'availability_mode' => 'immediate',
                ],
                'agent_email' => 'noraini.hassan@example.com',
                'developer_slug' => 'subang-urban-living',
                'property_type' => 'Terrace / Link House',
                'property_sub_type' => '2-storey Terrace House',
                'property_unit_type' => 'Intermediate',
                'location' => [
                    'development_name' => 'USJ 5',
                    'address_line1' => 'USJ 5, Subang Jaya',
                    'city' => 'Subang Jaya',
                    'state' => 'Selangor',
                    'postal_code' => '47610',
                    'country' => 'Malaysia',
                    'latitude' => 3.0469,
                    'longitude' => 101.5923,
                    'street' => 'USJ 5/1',
                    'title_type' => 'Individual',
                    'tenure' => 'Freehold',
                    'is_bumi_lot' => false,
                ],
            ],
            [
                'reference_number' => 'IPP500220001',
                'title' => 'Damansara Uptown Loft',
                'status' => 'draft',
                'listing_type' => 'sale',
                'category' => 'residential',
                'price_value' => 950000,
                'price_display' => 'RM 950,000',
                'price_type' => 'fixed',
                'tenure' => 'Leasehold',
                'completion_year' => '2016',
                'headline' => 'Loft sanctuary with skyline panoramas',
                'description' => 'Dramatic double-volume living framed by metropolitan vistas with a floating staircase that leads to a glass-encased study.',
                'has_video' => false,
                'has_virtual_tour' => false,
                'has_floorplan' => false,
                'attributes' => [
                    'built_up_sqft' => 1200,
                    'bedrooms' => 2,
                    'bathrooms' => 2,
                    'parking' => 1,
                    'furnishing' => 'Partially furnished',
                ],
                'metadata' => [
                    'listing_purpose' => 'sale',
                    'availability_mode' => 'scheduled',
                    'available_date' => '2025-12-01',
                ],
                'agent_email' => 'ravi.shan@example.com',
                'developer_slug' => 'damansara-uptown-properties',
                'property_type' => 'Apartment / Condo / Service Residence',
                'property_sub_type' => 'Loft',
                'property_unit_type' => 'Loft',
                'location' => [
                    'development_name' => 'Damansara Uptown Loft',
                    'address_line1' => 'Damansara Uptown',
                    'city' => 'Petaling Jaya',
                    'state' => 'Selangor',
                    'postal_code' => '47400',
                    'country' => 'Malaysia',
                    'latitude' => 3.1304,
                    'longitude' => 101.6251,
                    'street' => 'Jalan SS 21',
                    'title_type' => 'Strata',
                    'tenure' => 'Leasehold',
                    'is_bumi_lot' => false,
                ],
            ],
        ];

        foreach ($listings as $listing) {
            $agentId = $agents[$listing['agent_email']] ?? null;
            if (! $agentId) {
                continue;
            }

            $developerId = $developers[$listing['developer_slug']] ?? null;
            $propertyTypeId = $propertyTypes[$listing['property_type']] ?? null;
            $propertySubTypeId = $propertySubTypes[$listing['property_sub_type']] ?? null;
            $propertyUnitTypeId = $propertyUnitTypes[$listing['property_unit_type']] ?? null;

            $payload = [
                'agent_id' => $agentId,
                'developer_id' => $developerId,
                'property_type_id' => $propertyTypeId,
                'property_sub_type_id' => $propertySubTypeId,
                'property_unit_type_id' => $propertyUnitTypeId,
                'title' => $listing['title'],
                'reference_number' => $listing['reference_number'],
                'status' => $listing['status'],
                'listing_type' => $listing['listing_type'],
                'category' => $listing['category'],
                'price_value' => $listing['price_value'],
                'price_display' => $listing['price_display'],
                'price_type' => $listing['price_type'],
                'tenure' => $listing['tenure'],
                'completion_year' => $listing['completion_year'],
                'headline' => $listing['headline'],
                'description' => $listing['description'],
                'has_video' => $listing['has_video'],
                'has_virtual_tour' => $listing['has_virtual_tour'],
                'has_floorplan' => $listing['has_floorplan'],
                'attributes' => json_encode($listing['attributes']),
                'metadata' => json_encode($listing['metadata']),
                'updated_at' => now(),
            ];

            $existing = DB::table('listings')->where('reference_number', $listing['reference_number'])->first();

            if ($existing) {
                DB::table('listings')->where('id', $existing->id)->update($payload);
                $listingId = $existing->id;
            } else {
                $listingId = (string) Str::ulid();
                DB::table('listings')->insert(array_merge($payload, [
                    'id' => $listingId,
                    'created_at' => now(),
                ]));
            }

            $locationPayload = array_merge(
                $listing['location'],
                [
                    'tenure' => $listing['location']['tenure'] ?? $listing['tenure'],
                    'updated_at' => now(),
                ],
            );

            $existingLocation = DB::table('listing_locations')->where('listing_id', $listingId)->first();

            if ($existingLocation) {
                DB::table('listing_locations')->where('listing_id', $listingId)->update($locationPayload);
            } else {
                DB::table('listing_locations')->insert(array_merge($locationPayload, [
                    'listing_id' => $listingId,
                    'created_at' => now(),
                ]));
            }
        }
    }
}
