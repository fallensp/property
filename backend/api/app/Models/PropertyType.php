<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PropertyType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'category',
        'description',
    ];

    public function subTypes(): HasMany
    {
        return $this->hasMany(PropertySubType::class);
    }

    public function unitTypes(): HasMany
    {
        return $this->hasMany(PropertyUnitType::class);
    }
}
