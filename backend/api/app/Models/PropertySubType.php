<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PropertySubType extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_type_id',
        'name',
        'slug',
        'description',
    ];

    public function propertyType(): BelongsTo
    {
        return $this->belongsTo(PropertyType::class);
    }

    public function unitTypes(): HasMany
    {
        return $this->hasMany(PropertyUnitType::class);
    }
}
