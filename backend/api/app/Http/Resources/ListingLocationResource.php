<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\ListingLocation */
class ListingLocationResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'development_name' => $this->development_name,
            'address_line1' => $this->address_line1,
            'address_line2' => $this->address_line2,
            'street' => $this->street,
            'city' => $this->city,
            'state' => $this->state,
            'postal_code' => $this->postal_code,
            'country' => $this->country,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'is_bumi_lot' => $this->is_bumi_lot,
            'title_type' => $this->title_type,
            'tenure' => $this->tenure,
            'google_place_id' => $this->google_place_id,
            'google_plus_code' => $this->google_plus_code,
            'google_formatted_address' => $this->google_formatted_address,
            'google_metadata' => $this->google_metadata,
        ];
    }
}
