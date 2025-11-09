<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DeveloperSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $developers = [
            [
                'name' => 'Glenmarie Development Sdn Bhd',
                'registration_number' => '889203-U',
                'email' => 'hello@glenmarie.dev',
                'phone' => '+603-1234-5678',
                'website' => 'https://glenmarie.example.com',
            ],
            [
                'name' => 'Damansara Uptown Properties',
                'registration_number' => '554433-A',
                'email' => 'contact@damansarauptown.my',
                'phone' => '+603-4444-7788',
                'website' => 'https://uptown.example.com',
            ],
            [
                'name' => 'Subang Urban Living',
                'registration_number' => '772299-X',
                'email' => 'support@subangurban.my',
                'phone' => '+603-8877-1122',
                'website' => 'https://subangurban.example.com',
            ],
        ];

        foreach ($developers as $developer) {
            $slug = Str::slug($developer['name']);
            $existing = DB::table('developers')->where('slug', $slug)->first();

            $payload = [
                'name' => $developer['name'],
                'slug' => $slug,
                'registration_number' => $developer['registration_number'],
                'email' => $developer['email'],
                'phone' => $developer['phone'],
                'website' => $developer['website'],
                'updated_at' => now(),
            ];

            if ($existing) {
                DB::table('developers')->where('id', $existing->id)->update($payload);
            } else {
                DB::table('developers')->insert(array_merge($payload, [
                    'id' => (string) Str::ulid(),
                    'created_at' => now(),
                ]));
            }
        }
    }
}
