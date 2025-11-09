<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Listing extends Model
{
    use HasFactory;
    use SoftDeletes;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'agent_id',
        'developer_id',
        'property_type_id',
        'property_sub_type_id',
        'property_unit_type_id',
        'title',
        'reference_number',
        'status',
        'listing_type',
        'category',
        'price_currency',
        'price_value',
        'price_display',
        'price_type',
        'available_from',
        'tenure',
        'completion_year',
        'headline',
        'description',
        'has_video',
        'has_virtual_tour',
        'has_floorplan',
        'attributes',
        'metadata',
    ];

    protected $casts = [
        'attributes' => 'array',
        'metadata' => 'array',
        'has_video' => 'boolean',
        'has_virtual_tour' => 'boolean',
        'has_floorplan' => 'boolean',
        'available_from' => 'date',
        'price_value' => 'integer',
    ];

    protected static function booted(): void
    {
        static::creating(function (Listing $listing): void {
            if (! $listing->id) {
                $listing->id = (string) Str::ulid();
            }
        });
    }

    public function agent(): BelongsTo
    {
        return $this->belongsTo(Agent::class);
    }

    public function developer(): BelongsTo
    {
        return $this->belongsTo(Developer::class);
    }

    public function propertyType(): BelongsTo
    {
        return $this->belongsTo(PropertyType::class);
    }

    public function propertySubType(): BelongsTo
    {
        return $this->belongsTo(PropertySubType::class);
    }

    public function propertyUnitType(): BelongsTo
    {
        return $this->belongsTo(PropertyUnitType::class);
    }

    public function location(): HasOne
    {
        return $this->hasOne(ListingLocation::class);
    }
}
