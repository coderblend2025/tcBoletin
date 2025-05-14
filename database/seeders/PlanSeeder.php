<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Plan;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Plan Básico',
                'description' => 'Acceso básico a los servicios de la plataforma.',
                'price' => 19.99,
                'duration_in_days' => 30,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Plan Avanzado',
                'description' => 'Acceso completo a todas las funcionalidades, incluyendo soporte prioritario.',
                'price' => 49.99,
                'duration_in_days' => 90,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Plan Premium',
                'description' => 'Acceso premium con características exclusivas y consultoría personalizada.',
                'price' => 99.99,
                'duration_in_days' => 180,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($plans as $plan) {
            Plan::create($plan);
        }
    }
}