<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HabitController;
use Illuminate\Support\Facades\Route;

// In a real app, wrap these in Route::middleware('auth:sanctum')
Route::group([], function () {

    Route::get('/', function () {
        return view('index');
    });

    // Dashboard Data (Habits + Logs combined)
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Habit Management
    Route::post('/habits', [HabitController::class, 'store']);
    Route::delete('/habits/{id}', [HabitController::class, 'destroy']);

    // Entry Actions
    Route::post('/entries/toggle', [DashboardController::class, 'toggle']);
    Route::post('/entries/note', [DashboardController::class, 'updateNote']);

    // Daily Log (Mood/Gratitude)
    Route::post('/dailylog', [DashboardController::class, 'updateLog']);

});
