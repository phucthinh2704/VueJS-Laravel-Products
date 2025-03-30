<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'phone', 'address', 'email', 'cart_items'];

    protected $casts = [
        'cart_items' => 'array',
    ];
}
