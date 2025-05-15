<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PlanController extends Controller
{
    public function index()
    {
        
        $plans = Plan::all()->map(function ($plan) {
            return [
                'id' => $plan->id,
                'name' => $plan->name,
                'description' => $plan->description,
                'price' => $plan->price,
                'formatted_price' => $plan->formatted_price,
                'duration_in_days' => $plan->duration_in_days,
                'duration_months' => $plan->duration_months,
                'created_at' => $plan->created_at->toDateString(),
                'updated_at' => $plan->updated_at->toDateString(),
            ];
        });

        return Inertia::render('Plans/Index', [
            'plans' => $plans,
            'can' => [
                'edit' => auth()->user()->hasRole('admin'),
                'delete' => auth()->user()->hasRole('admin'),
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Plans/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'duration_in_days' => 'required|integer|min:1',
        ]);

        Plan::create($validated);

        return redirect()->route('plans.index')->with('success', 'Plan creado correctamente.');
    }

    public function edit(Plan $plan)
    {
        return Inertia::render('Plans/Edit', [
            'plan' => $plan,
        ]);
    }

    public function update(Request $request, Plan $plan)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'duration_in_days' => 'required|integer|min:1',
        ]);

        $plan->update($validated);

        return redirect()->route('plans.index')->with('success', 'Plan actualizado correctamente.');
    }

    public function destroy(Plan $plan)
    {
        $plan->delete();

        return redirect()->route('plans.index')->with('success', 'Plan eliminado correctamente.');
    }
}