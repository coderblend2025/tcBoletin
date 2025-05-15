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
    ];

    // Opcional: Formatear el precio para el frontend
    public function getFormattedPriceAttribute()
    {
        return '$' . number_format($this->price, 2);
    }

    // Opcional: Calcular duración en meses para el frontend
    public function getDurationMonthsAttribute()
    {
        return round($this->duration_in_days / 30);
    }
}