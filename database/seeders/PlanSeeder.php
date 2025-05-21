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
                'condicion' => json_encode([
                    'Acceso limitado a 5 usuarios',
                    'Soporte por correo electrónico',
                    'Almacenamiento de 10GB'
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Plan Avanzado',
                'description' => 'Acceso completo a todas las funcionalidades, incluyendo soporte prioritario.',
                'price' => 49.99,
                'duration_in_days' => 90,
                'condicion' => json_encode([
                    'Acceso para hasta 15 usuarios',
                    'Soporte prioritario 24/5',
                    'Almacenamiento de 50GB',
                    'Informes mensuales'
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Plan Premium',
                'description' => 'Acceso premium con características exclusivas y consultoría personalizada.',
                'price' => 99.99,
                'duration_in_days' => 180,
                'condicion' => json_encode([
                    'Usuarios ilimitados',
                    'Soporte 24/7 con respuesta en 1 hora',
                    'Almacenamiento ilimitado',
                    'Consultoría mensual personalizada',
                    'Acceso a beta features'
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($plans as $plan) {
            Plan::create($plan);
        }
    }
}