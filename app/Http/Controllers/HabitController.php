<?php

namespace App\Http\Controllers;

use App\Models\Habit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HabitController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'period' => 'required|string',
            'routineType' => 'required|string', // Maps to routine_type
            'isTimeMode' => 'boolean',          // Maps to is_time_mode
            'time' => 'nullable|string',        // Maps to time_value
            'icon' => 'required|string',
        ]);

        $habit = Habit::create([
            'user_id' => 1, // Replace with Auth::id() when auth is ready
            'title' => $validated['title'],
            'description' => $validated['description'],
            'period' => $validated['period'],
            'routine_type' => $validated['routineType'],
            'is_time_mode' => $validated['isTimeMode'] ?? false,
            'time_value' => $validated['time'],
            'icon' => $validated['icon'],
        ]);

        return response()->json($habit, 201);
    }

    public function destroy($id)
    {
        // Soft delete logic could go here, for now hard delete
        Habit::where('id', $id)->where('user_id', 1)->delete(); 
        return response()->json(['message' => 'Deleted']);
    }
}