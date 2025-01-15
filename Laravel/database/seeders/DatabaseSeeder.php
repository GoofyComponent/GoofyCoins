<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@test.test',
            'password' => bcrypt('test@test.test'),
        ]);

        User::factory()->create([
            'name' => 'Adrien',
            'email' => 'adrialb95@gmail.com',
            'password' => bcrypt('password'),
        ]);
    }
}
