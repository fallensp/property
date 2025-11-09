<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PropertyUnitType extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_type_id',
        'property_sub_type_id',
        'name',
        'slug',
        'description',
    ];

    public function propertyType(): BelongsTo
    {
        return $this->belongsTo(PropertyType::class);
    }

    public function propertySubType(): BelongsTo
    {
        return $this->belongsTo(PropertySubType::class);
    }
}
