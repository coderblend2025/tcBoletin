<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExchangePoint extends Model
{
    protected $fillable = ['name', 'location', 'description'];
}