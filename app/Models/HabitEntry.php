<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HabitEntry extends Model
{
    protected $guarded = [];

    public function habit()
    {
        return $this->belongsTo(Habit::class);
    }
}