<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LocationMoneyChanger extends Model
{
    protected $table = 'location_money_changer';

    protected $fillable = [
        'name',
        'code',
        'ubication_name',
        'lan',
        'log',
        'status'
    ];
} 