<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'duration_in_days',
        'condicion',
    ];

    protected $casts = [
        'condicion' => 'array',
    ];

    public function getFormattedPriceAttribute()
    {
        return '$' . number_format($this->price, 2);
    }

    public function getDurationMonthsAttribute()
    {
        return round($this->duration_in_days / 30);
    }
}