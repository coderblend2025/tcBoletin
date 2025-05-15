<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index(Request $request)
    {
        // Validación y configuración de paginación
        $perPage = $request->input('per_page', 10);
        $validPerPage = in_array($perPage, [5, 10, 20, 50]) ? (int)$perPage : 10;
        $page = $request->input('page', 1);

        // Búsqueda si existe
        $searchTerm = $request->input('search', '');

        // Consulta base con eager loading de roles
        $usersQuery =  User::with(['roles'])
            ->when($searchTerm, function ($query, $searchTerm) {
                return $query->where(function ($q) use ($searchTerm) {
                    $q->where('name', 'like', "%{$searchTerm}%")
                      ->orWhere('email', 'like', "%{$searchTerm}%");
                });
            });

        // Paginación y transformación de datos
        $users = $usersQuery->paginate($validPerPage, ['*'], 'page', $page)
            ->through(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->getRoleNames()->first() ?? 'Sin rol',
                ];
            });

        return Inertia::render('Users/Index', [
            'users' => [
                'data' => $users->items(),
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ],
            'filters' => [
                'search' => $searchTerm,
                'per_page' => $validPerPage,
            ]
        ]);
    }
}