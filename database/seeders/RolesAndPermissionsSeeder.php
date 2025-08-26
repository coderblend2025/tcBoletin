<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Hash;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Limpiar caché de permisos y roles
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Crear permisos básicos
        $permissions = [
            'view dashboard',
            'edit profile',
            'manage users',
            'manage services',
            'manage subscriptions',
            'manage traders',
            'view services',
            'view own subscriptions',
            'view traders', // Nuevo permiso para ver punto de cambio
            'view admin dashboard', // Nuevo permiso para ver dashboard administrador
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Crear roles
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $guestRole = Role::firstOrCreate(['name' => 'guest']);
        $customerRole = Role::firstOrCreate(['name' => 'customer']);
        $consultorRole = Role::firstOrCreate(['name' => 'consultor']);

        // Asignar permisos a roles
        $adminRole->syncPermissions(Permission::all());
        $guestRole->syncPermissions([
            'view dashboard',
            'view traders', // Solo dashboard y punto de cambio para guest
        ]);
        $customerRole->syncPermissions([
            'view dashboard',
            'edit profile',
            'view services',
            'view own subscriptions',
        ]);
        $consultorRole->syncPermissions([
            'view dashboard',
            'view traders', // Acceso al punto de cambio
            'view admin dashboard', // Acceso al dashboard administrador
        ]);

        // Crear usuarios y asignar roles
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(), // opcional: marcar correo como verificado
            ]
        );
        $admin->assignRole($adminRole);

        $guest = User::firstOrCreate(
            ['email' => 'guest@example.com'],
            [
                'name' => 'Guest User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $guest->assignRole($guestRole);

        $customer = User::firstOrCreate(
            ['email' => 'customer@example.com'],
            [
                'name' => 'Customer User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $customer->assignRole($customerRole);

        $consultor = User::firstOrCreate(
            ['email' => 'consultor@example.com'],
            [
                'name' => 'Consultor User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $consultor->assignRole($consultorRole);
    }
}
