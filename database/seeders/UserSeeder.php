<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            'username' => 'admin',
            'phoneNumber' => '1234567890',
            'password' => Hash::make('1234.asdf'), // Hash the password
            'plainPassword' => '1234.asdf', // Store the plain password (not recommended for production)
            'type' => 'Manager',
            'area' => null,
            'fcm_token' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}