<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Listing */
class ListingResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'agent_id' => $this->agent_id,
            'developer_id' => $this->developer_id,
            'reference_number' => $this->reference_number,
            'title' => $this->title,
            'status' => $this->status,
            'listing_type' => $this->listing_type,
            'category' => $this->category,
            'price_currency' => $this->price_currency,
            'price_value' => $this->price_value,
            'price_display' => $this->price_display,
            'price_type' => $this->price_type,
            'available_from' => $this->available_from?->toDateString(),
            'tenure' => $this->tenure,
            'completion_year' => $this->completion_year,
            'headline' => $this->headline,
            'description' => $this->description,
            'has_video' => $this->has_video,
            'has_virtual_tour' => $this->has_virtual_tour,
            'has_floorplan' => $this->has_floorplan,
            'attributes' => $this->getAttribute('attributes'),
            'metadata' => $this->metadata,
            'property_type' => $this->whenLoaded('propertyType', function () {
                return [
                    'id' => $this->propertyType->id,
                    'name' => $this->propertyType->name,
                ];
            }),
            'property_sub_type' => $this->whenLoaded('propertySubType', function () {
                return [
                    'id' => $this->propertySubType->id,
                    'name' => $this->propertySubType->name,
                ];
            }),
            'property_unit_type' => $this->whenLoaded('propertyUnitType', function () {
                return [
                    'id' => $this->propertyUnitType->id,
                    'name' => $this->propertyUnitType->name,
                ];
            }),
            'location' => ListingLocationResource::make($this->whenLoaded('location')),
            'agent' => $this->whenLoaded('agent', fn () => [
                'id' => $this->agent->id,
                'full_name' => $this->agent->full_name,
                'email' => $this->agent->email,
                'phone' => $this->agent->phone,
            ]),
            'developer' => $this->whenLoaded('developer', fn () => [
                'id' => $this->developer->id,
                'name' => $this->developer->name,
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
