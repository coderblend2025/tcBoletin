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
                'conditions' => $plan->condicion ? json_decode($plan->condicion) : [],
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
            'conditions' => 'nullable|array',
        ]);

        $planData = [
            'name' => $validated['name'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'duration_in_days' => $validated['duration_in_days'],
            'condicion' => isset($validated['conditions']) ? json_encode($validated['conditions']) : null,
        ];

        Plan::create($planData);

        return redirect()->route('plans.index')->with('success', 'Plan creado correctamente.');
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

    public function update(Request $request, Plan $plan)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'duration_in_days' => 'required|integer|min:1',
            'conditions' => 'nullable|array',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'duration_in_days' => $validated['duration_in_days'],
            'condicion' => isset($validated['conditions']) ? json_encode($validated['conditions']) : null,
        ];

        $plan->update($updateData);

        return redirect()->back()->with('success', 'Plan actualizado correctamente.');
    }

    public function destroy(Plan $plan)
    {
        $plan->delete();

        return redirect()->route('plans.index')->with('success', 'Plan eliminado correctamente.');
    }
}