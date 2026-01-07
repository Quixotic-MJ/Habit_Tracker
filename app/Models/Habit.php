<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Habit extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'is_time_mode' => 'boolean',
        'is_archived' => 'boolean',
    ];

    public function entries()
    {
        return $this->hasMany(HabitEntry::class);
    }
}