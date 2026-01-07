<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HabitController;
use App\Http\Controllers\DashboardController;

// In a real app, wrap these in Route::middleware('auth:sanctum')
Route::group([], function () {
    
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