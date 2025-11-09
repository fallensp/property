<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreListingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'developer_id' => ['nullable', 'exists:developers,id'],
            'property_type_id' => ['required', 'exists:property_types,id'],
            'property_sub_type_id' => ['nullable', 'exists:property_sub_types,id'],
            'property_unit_type_id' => ['nullable', 'exists:property_unit_types,id'],
            'title' => ['required', 'string', 'max:255'],
            'reference_number' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'string', 'max:255'],
            'listing_type' => ['required', 'in:sale,rent'],
            'category' => ['required', 'string', 'max:255'],
            'price_currency' => ['nullable', 'string', 'max:3'],
            'price_value' => ['nullable', 'integer', 'min:0'],
            'price_display' => ['nullable', 'string', 'max:255'],
            'price_type' => ['nullable', 'string', 'max:255'],
            'available_from' => ['nullable', 'date'],
            'tenure' => ['nullable', 'string', 'max:255'],
            'completion_year' => ['nullable', 'string', 'max:4'],
            'headline' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'has_video' => ['sometimes', 'boolean'],
            'has_virtual_tour' => ['sometimes', 'boolean'],
            'has_floorplan' => ['sometimes', 'boolean'],
            'attributes' => ['nullable', 'array'],
            'metadata' => ['nullable', 'array'],
            'location' => ['required', 'array'],
            'location.development_name' => ['nullable', 'string', 'max:255'],
            'location.address_line1' => ['nullable', 'string', 'max:255'],
            'location.address_line2' => ['nullable', 'string', 'max:255'],
            'location.street' => ['nullable', 'string', 'max:255'],
            'location.city' => ['nullable', 'string', 'max:255'],
            'location.state' => ['nullable', 'string', 'max:255'],
            'location.postal_code' => ['nullable', 'string', 'max:20'],
            'location.country' => ['nullable', 'string', 'max:255'],
            'location.latitude' => ['nullable', 'numeric'],
            'location.longitude' => ['nullable', 'numeric'],
            'location.is_bumi_lot' => ['nullable', 'boolean'],
            'location.title_type' => ['nullable', 'string', 'max:255'],
            'location.tenure' => ['nullable', 'string', 'max:255'],
            'location.google_place_id' => ['nullable', 'string', 'max:255'],
            'location.google_plus_code' => ['nullable', 'string', 'max:255'],
            'location.google_formatted_address' => ['nullable', 'string', 'max:255'],
            'location.google_metadata' => ['nullable', 'array'],
        ];
    }
}
