<?php

namespace Database\Seeders;

use App\Models\Agent;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            PropertyMetadataSeeder::class,
            DeveloperSeeder::class,
            AgentSeeder::class,
            ListingSeeder::class,
        ]);

        $user = User::query()->updateOrCreate(
            ['email' => 'agent@example.com'],
            [
                'name' => 'Portal Agent',
                'password' => Hash::make('password'),
            ]
        );

        $agent = Agent::query()->orderBy('created_at')->first();

        if ($agent && $agent->user_id !== $user->id) {
            $agent->user_id = $user->id;
            $agent->save();
        }
    }
}
