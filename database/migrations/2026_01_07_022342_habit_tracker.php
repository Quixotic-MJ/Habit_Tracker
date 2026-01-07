<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Habits Table
        Schema::create('habits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('icon')->default('sun'); // sun, moon, book, coffee, drop, leaf
            $table->string('period')->default('morning'); // morning, afternoon, evening
            $table->string('routine_type')->default('Daily'); // Daily, Weekly, One-time
            $table->boolean('is_time_mode')->default(false);
            $table->string('time_value')->nullable(); // "07:00" or "30 mins"
            $table->boolean('is_archived')->default(false);
            $table->timestamps();
        });

        // 2. Habit Entries (The actual tracking)
        Schema::create('habit_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('habit_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->string('status')->default('pending'); // pending, completed, skipped
            $table->text('note')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->unique(['habit_id', 'date']); // One entry per habit per day
        });

        // 3. Daily Logs (Mood, Gratitude)
        Schema::create('daily_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->string('mood')->nullable(); // sun, cloud, rain
            $table->text('gratitude')->nullable();
            $table->text('reflection')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'date']); // One log per user per day
        });

        // 4. User Settings
        Schema::create('user_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('weekly_intention')->nullable();
            $table->string('preferred_view')->default('routine'); // routine, grid
            $table->integer('start_of_day_hour')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_settings');
        Schema::dropIfExists('daily_logs');
        Schema::dropIfExists('habit_entries');
        Schema::dropIfExists('habits');
    }
};