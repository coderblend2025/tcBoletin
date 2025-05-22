<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ExchangePointsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\ExchangePoint::create([
            'name' => 'Plaza 14 de Septiembre',
            'location' => 'Cochabamba',
            'description' => 'Punto principal de cambio'
        ]);
    }
}
