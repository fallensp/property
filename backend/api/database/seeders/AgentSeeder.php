<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AgentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $developers = DB::table('developers')->pluck('id', 'slug');

        $agents = [
            [
                'full_name' => 'Ainsley Foo',
                'email' => 'ainsley.foo@example.com',
                'phone' => '+6012-888-9988',
                'license_number' => 'REN 12345',
                'developer_slug' => 'glenmarie-development-sdn-bhd',
            ],
            [
                'full_name' => 'Ravi Shanmugam',
                'email' => 'ravi.shan@example.com',
                'phone' => '+6019-223-4455',
                'license_number' => 'REN 88990',
                'developer_slug' => 'damansara-uptown-properties',
            ],
            [
                'full_name' => 'Noraini Hassan',
                'email' => 'noraini.hassan@example.com',
                'phone' => '+6013-556-7788',
                'license_number' => 'REN 66778',
                'developer_slug' => 'subang-urban-living',
            ],
        ];

        foreach ($agents as $agent) {
            $existing = DB::table('agents')->where('email', $agent['email'])->first();
            $payload = [
                'full_name' => $agent['full_name'],
                'email' => $agent['email'],
                'phone' => $agent['phone'],
                'license_number' => $agent['license_number'],
                'developer_id' => $developers[$agent['developer_slug']] ?? null,
                'status' => 'active',
                'updated_at' => now(),
            ];

            if ($existing) {
                DB::table('agents')->where('id', $existing->id)->update($payload);
            } else {
                DB::table('agents')->insert(array_merge($payload, [
                    'id' => (string) Str::ulid(),
                    'created_at' => now(),
                ]));
            }
        }
    }
}
