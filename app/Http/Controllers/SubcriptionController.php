<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Subcription;

class SubcriptionController extends Controller
{
    public function index(Request $request)
    {

        $perPage = $request->input('per_page', 10);
        $validPerPage = in_array($perPage, [5, 10, 20, 50]) ? (int)$perPage : 10;
        $page = $request->input('page', 1);

        $searchTerm = $request->input('search', '');

        $subcriptionQuery = Subcription::query()
            ->with('user', 'plan')
            ->when($searchTerm, function ($query, $searchTerm) {
                return $query->where(function ($q) use ($searchTerm) {
                    $q->orWhereHas('user', function ($q) use ($searchTerm) {
                            $q->where('name', 'like', "%{$searchTerm}%")
                              ->orWhere('email', 'like', "%{$searchTerm}%");
                        })
                        ->orWhereHas('plan', function ($q) use ($searchTerm) {;
                            $q->where('name', 'like', "%{$searchTerm}%")
                              ->orWhere('description', 'like', "%{$searchTerm}%");
                        });
                });
            });
        
    

        $users = User::all();
        $plans = Plan::all();
        
        $subcriptions = $subcriptionQuery->paginate($validPerPage, ['*'], 'page', $page)
            ->through(function ($subcription) {
                return [
                    'id' => $subcription->id,
                    'start_date' => $subcription->start_date,
                    'end_date' => $subcription->end_date,
                    'status' => $subcription->status,
                    'user' => [
                        'id' => $subcription->user?->id,
                        'name' => $subcription->user?->name,
                        'email' => $subcription->user?->email,
                        'role' => $subcription->user?->roles->first()?->name,
                    ],
                    'plan' => [
                        'id' => $subcription->plan?->id,
                        'name' => $subcription->plan?->name,
                        'description' => $subcription->plan?->description,
                        'price' => $subcription->plan?->price,
                        'duration_in_days' => $subcription->plan?->duration_in_days,
                    ],
                ];
            });

        return Inertia::render('subcription/Index', [
            'subcriptions' => $subcriptions,
            'can' => [
                'edit' => auth()->user()->hasRole('admin'),
                'delete' => auth()->user()->hasRole('admin'),
            ],
            'users' =>  $users,
            'plans' =>  $plans,
        ]);
    }


    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'id_user' => 'required|exists:users,id',
            'id_plan' => 'required|exists:plans,id',
            'status' => 'required|string',
        ]);

        $plan = Plan::findOrFail($validated['id_plan']);

        $subcription = Subcription::findOrFail($id);

        $startDate = $subcription->start_date ?? now();
        $endDate = (clone $startDate)->addDays($plan->duration_in_days);

        $subcription->update([
            'id_user' => $validated['id_user'],
            'id_plan' => $validated['id_plan'],
            'status' => $validated['status'],
            'start_date' => $startDate,
            'end_date' => $endDate,
        ]);

        return redirect()->route('subscriptions.index')->with('success', 'Suscripción actualizada correctamente.');
    }

        public function show($id, Request $request)
    {
        $validated = $request->validate([
            'id_user' => 'required|exists:users,id',
            'id_plan' => 'required|exists:plans,id',
            'status' => 'required|string',
        ]);

        $plan = Plan::findOrFail($validated['id_plan']);
        $subcription = Subcription::findOrFail($id);

        $startDate = $subcription->start_date ?? now();
        $endDate = (clone $startDate)->addDays($plan->duration_in_days);

        $subcription->update([
            'id_user' => $validated['id_user'],
            'id_plan' => $validated['id_plan'],
            'status' => $validated['status'],
            'start_date' => $startDate,
            'end_date' => $endDate,
        ]);

        return redirect()->route('subscriptions.index')->with('success', 'Suscripción actualizada correctamente.');
    }

    
    public function create()
    {
        return Inertia::render('Plans/Create');
    }

    public function creator(Request $request)
    {
        $validated = $request->validate([
            'id_user' => 'required|exists:users,id',
            'id_plan' => 'required|exists:plans,id',
            'status' => 'required|string',
        ]);

        $plan = Plan::findOrFail($validated['id_plan']);

        $startDate = now();
        $endDate = $startDate->copy()->addDays($plan->duration_in_days);

        Subcription::create([
            'id_user' => $validated['id_user'],
            'id_plan' => $validated['id_plan'],
            'status' => $validated['status'],
            'start_date' => $startDate,
            'end_date' => $endDate,
        ]);

        return redirect()->route('subscriptions.index')->with('success', 'Suscripción creada correctamente.');
    }

    public function edit(Plan $plan)
    {
        return Inertia::render('Plans/Edit', [
            'plan' => [
                'id' => $plan->id,
                'name' => $plan->name,
                'description' => $plan->description,
                'price' => $plan->price,
                'duration_in_days' => $plan->duration_in_days,
                'conditions' => $plan->condicion ? json_decode($plan->condicion) : [],
            ],
        ]);
    }




    public function destroy($id)
    {
        $subcription = Subcription::findOrFail($id);
        $subcription->delete();
        return redirect()->route('subscriptions.index')->with('success', 'Suscripción eliminada correctamente.');
    }
}