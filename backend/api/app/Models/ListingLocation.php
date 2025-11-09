<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ListingLocation extends Model
{
    use HasFactory;

    protected $fillable = [
        'listing_id',
        'development_name',
        'address_line1',
        'address_line2',
        'street',
        'city',
        'state',
        'postal_code',
        'country',
        'latitude',
        'longitude',
        'is_bumi_lot',
        'title_type',
        'tenure',
        'google_place_id',
        'google_plus_code',
        'google_formatted_address',
        'google_metadata',
    ];

    protected $casts = [
        'google_metadata' => 'array',
        'is_bumi_lot' => 'boolean',
        'latitude' => 'float',
        'longitude' => 'float',
    ];

    public function listing(): BelongsTo
    {
        return $this->belongsTo(Listing::class);
    }
}
