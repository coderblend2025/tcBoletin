<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
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
        $usersQuery = User::query()
            ->with('roles')
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
                    'role' => $user->roles->first()?->name,
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
            ],
            'roles' => Role::all()->pluck('name'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string|exists:roles,name',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password ' => Hash::make($validated['password']),
        ]);

        $user->assignRole($validated['role']);

        return back()->with('success', 'Usuario creado exitosamente');
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'role' => 'required|string|exists:roles,name',
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        // Update role
        $user->syncRoles([$validated['role']]);

        return back()->with('success', 'Usuario actualizado exitosamente');
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return back()->with('success', 'Usuario eliminado exitosamente');
    }

    public function create() {
    
    }
}