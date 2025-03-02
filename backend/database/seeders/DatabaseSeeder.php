<?php

namespace Database\Seeders;

use App\Models\CarbonFootPrint;
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
        User::factory(2)->create();
        CarbonFootPrint::factory(200)->create();
    }
}
