<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LocationMoneyChangerPrice extends Model
{
    use HasFactory;

    protected $table = 'location_money_changer_price';

    protected $fillable = [
        'id_location_money_changer',
        'price_sale',
        'price_buy',
    ];

    // Esto es opcional si ya está activado por defecto
    public $timestamps = true;

    public function locationMoneyChanger()
    {
        return $this->belongsTo(LocationMoneyChanger::class, 'id_location_money_changer');
    }
}