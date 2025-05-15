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
            'code' => 'required|string|max:255|unique:location_money_changer',
            'ubication' => 'required|string|max:255',
            'lat' => 'required|string',
            'log' => 'required|string',
        ]);

        $trader = LocationMoneyChanger::create([
            'name' => $validated['name'],
            'code' => $validated['code'],
            'ubication_name' => $validated['ubication'],
            'lan' => $validated['lat'],
            'log' => $validated['log'],
            'status' => true
        ]);

        return back()->with('success', 'Trader created successfully');
    }
}
