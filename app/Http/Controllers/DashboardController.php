<?php

namespace App\Http\Controllers;

use App\Models\Habit;
use App\Models\HabitEntry;
use App\Models\DailyLog;
use App\Models\UserSetting;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    // GET /api/dashboard
    public function index(Request $request)
    {
        $userId = 1; // Replace with Auth::id()
        $date = $request->query('date', Carbon::today()->toDateString());
        
        // 1. Get Habits
        $habits = Habit::where('user_id', $userId)
            ->where('is_archived', false)
            ->get();

        // 2. Process Habits to attach 'status' for Today and 'history' for Grid
        $processedHabits = $habits->map(function ($habit) use ($date) {
            // Get entry for the selected date
            $todayEntry = $habit->entries()->where('date', $date)->first();
            
            // Get last 14 days history for the grid (0s and 1s)
            // We fetch entries from (Date - 13 days) to (Date)
            $startDate = Carbon::parse($date)->subDays(13)->toDateString();
            $historyEntries = $habit->entries()
                ->whereBetween('date', [$startDate, $date])
                ->get()
                ->keyBy('date');

            $history = [];
            for ($i = 13; $i >= 0; $i--) {
                $d = Carbon::parse($date)->subDays($i)->toDateString();
                $entry = $historyEntries->get($d);
                $history[] = ($entry && $entry->status === 'completed') ? 1 : 0;
            }

            return [
                'id' => $habit->id,
                'title' => $habit->title,
                'description' => $habit->description,
                'period' => $habit->period,
                'routineType' => $habit->routine_type,
                'time' => $habit->time_value,
                'isTimeMode' => $habit->is_time_mode,
                'icon' => $habit->icon,
                'status' => $todayEntry ? $todayEntry->status : 'pending',
                'note' => $todayEntry ? $todayEntry->note : '',
                'history' => $history
            ];
        });

        // 3. Get Daily Log
        $dailyLog = DailyLog::firstOrCreate(
            ['user_id' => $userId, 'date' => $date],
            ['mood' => null, 'gratitude' => '']
        );

        // 4. Get Settings
        $settings = UserSetting::firstOrCreate(['user_id' => $userId]);

        return response()->json([
            'date' => $date,
            'habits' => $processedHabits,
            'dailyLog' => $dailyLog,
            'settings' => $settings
        ]);
    }

    // POST /api/entries/toggle
    public function toggle(Request $request)
    {
        $validated = $request->validate([
            'habit_id' => 'required|exists:habits,id',
            'date' => 'required|date',
            'status' => 'required|in:pending,completed,skipped'
        ]);

        $entry = HabitEntry::updateOrCreate(
            [
                'habit_id' => $validated['habit_id'],
                'date' => $validated['date']
            ],
            [
                'status' => $validated['status'],
                'completed_at' => $validated['status'] === 'completed' ? now() : null
            ]
        );

        return response()->json($entry);
    }

    // POST /api/entries/note
    public function updateNote(Request $request)
    {
        $validated = $request->validate([
            'habit_id' => 'required|exists:habits,id',
            'date' => 'required|date',
            'note' => 'nullable|string'
        ]);

        $entry = HabitEntry::updateOrCreate(
            ['habit_id' => $validated['habit_id'], 'date' => $validated['date']],
            ['note' => $validated['note']]
        );

        return response()->json($entry);
    }

    // POST /api/dailylog
    public function updateLog(Request $request)
    {
        $userId = 1; // Auth::id()
        $validated = $request->validate([
            'date' => 'required|date',
            'mood' => 'nullable|string',
            'gratitude' => 'nullable|string'
        ]);

        $log = DailyLog::updateOrCreate(
            ['user_id' => $userId, 'date' => $validated['date']],
            [
                'mood' => $validated['mood'] ?? null, 
                'gratitude' => $validated['gratitude'] ?? null
            ]
        );

        return response()->json($log);
    }
}