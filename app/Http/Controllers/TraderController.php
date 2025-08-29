<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LocationMoneyChanger;
use Inertia\Inertia;

class TraderController extends Controller
{
    public function index(Request $request)
    {
        // Validation and pagination configuration
        $perPage = $request->input('per_page', 10);
        $validPerPage = in_array($perPage, [5, 10, 20, 50]) ? (int)$perPage : 10;
        $page = $request->input('page', 1);

        // Search if exists
        $searchTerm = $request->input('search', '');

        // Query database
        $locationsQuery = LocationMoneyChanger::query()
            ->when($searchTerm, function ($query, $searchTerm) {
                return $query->where(function ($q) use ($searchTerm) {
                    $q->where('name', 'like', "%{$searchTerm}%")
                      ->orWhere('code', 'like', "%{$searchTerm}%")
                      ->orWhere('ubication_name', 'like', "%{$searchTerm}%");
                });
            });

        // Pagination and data transformation
        $locations = $locationsQuery->paginate($validPerPage, ['*'], 'page', $page)
            ->through(function ($location) {
                return [
                    'id' => $location->id,
                    'name' => $location->name,
                    'code' => $location->code,
                    'lan' => $location->lan,
                    'log' => $location->log,
                    'ubication_name' => $location->ubication_name,
                    'status' => $location->status,
                ];
            });

        return Inertia::render('traders', [
            'traders' => [
                'data' => $locations->items(),
                'current_page' => $locations->currentPage(),
                'last_page' => $locations->lastPage(),
                'per_page' => $locations->perPage(),
                'total' => $locations->total(),
            ],
            'filters' => [
                'search' => $searchTerm,
                'per_page' => $validPerPage,
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255',
            'ubication' => 'required|string|max:255',
            'lat' => 'required|string',
            'log' => 'required|string',
        ]);

        // Generar el código base con prefijo TC-
        $baseCode = 'TC-' . $validated['code'];
        $code = $baseCode;
        $ubication = $validated['ubication'];

        $suffix = 2;

        // Buscar si ya existe un code igual con la misma ubicación
        $count = LocationMoneyChanger::where('ubication_name', $ubication)
                 ->count();

        if ($count > 0) {
            // Si ya existe, incrementar el sufijo
            $code = 'TC-' . ($count + 1) . '-' . $validated['code'];
        }else {
            $suffix = 1; // Si no existe, iniciar con sufijo 1
             $code = 'TC-' . $validated['code'];
        }
     
        
        // Crear el trader
        $trader = LocationMoneyChanger::create([
            'name' => $validated['name'],
            'code' => $code,
            'ubication_name' => $ubication,
            'lan' => $validated['lat'],
            'log' => $validated['log'],
            'status' => true
        ]);

        return back()->with('success', 'Trader created successfully');
    }

    public function update(Request $request, $id)
    {
        $trader = LocationMoneyChanger::findOrFail($id);

        // Solo valida los campos enviados y no vacíos
        $rules = [];
        $fields = ['name', 'code', 'ubication', 'lat', 'log'];
        foreach ($fields as $field) {
            if ($request->has($field) && $request->$field !== null && $request->$field !== '') {
                if ($field === 'code') {
                    $rules[$field] = 'string|max:255|unique:location_money_changer,code,' . $id;
                } elseif ($field === 'ubication') {
                    $rules[$field] = 'string|max:255';
                } else {
                    $rules[$field] = 'string|max:255';
                }
            }
        }
        $validated = $request->validate($rules);

        $updateData = [];
        // Solo actualiza los campos enviados y no vacíos
        foreach ($fields as $field) {
            if (isset($validated[$field]) && $validated[$field] !== null && $validated[$field] !== '') {
                if ($field === 'ubication') {
                    // Validación de ubicación solo si se envía
                    $ubication = $validated['ubication'];
                    $count = LocationMoneyChanger::where('ubication_name', $ubication)->count();
                    if ($count > 0) {
                        $updateData['code'] = 'TC-' . ($count + 1) . '-' . ($validated['code'] ?? $trader->code);
                    } else {
                        $updateData['code'] = 'TC-' . ($validated['code'] ?? $trader->code);
                    }
                    $updateData['ubication_name'] = $ubication;
                } elseif ($field === 'code' && !isset($updateData['code'])) {
                    $updateData['code'] = $validated['code'];
                } elseif ($field === 'name') {
                    $updateData['name'] = $validated['name'];
                } elseif ($field === 'lat') {
                    $updateData['lan'] = $validated['lat'];
                } elseif ($field === 'log') {
                    $updateData['log'] = $validated['log'];
                }
            }
        }

        if (!empty($updateData)) {
            $trader->update($updateData);
        }

        return back()->with('success', 'Trader updated successfully');
    }

    public function destroy($id)
    {
        $trader = LocationMoneyChanger::findOrFail($id);
        $trader->delete();
        
        return back()->with('success', 'Trader deleted successfully');
    }
}
