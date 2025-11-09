<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateListingRequest extends FormRequest
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
            'developer_id' => ['sometimes', 'nullable', 'exists:developers,id'],
            'property_type_id' => ['sometimes', 'exists:property_types,id'],
            'property_sub_type_id' => ['sometimes', 'nullable', 'exists:property_sub_types,id'],
            'property_unit_type_id' => ['sometimes', 'nullable', 'exists:property_unit_types,id'],
            'title' => ['sometimes', 'string', 'max:255'],
            'reference_number' => ['sometimes', 'nullable', 'string', 'max:255'],
            'status' => ['sometimes', 'string', 'max:255'],
            'listing_type' => ['sometimes', 'in:sale,rent'],
            'category' => ['sometimes', 'string', 'max:255'],
            'price_currency' => ['sometimes', 'nullable', 'string', 'max:3'],
            'price_value' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'price_display' => ['sometimes', 'nullable', 'string', 'max:255'],
            'price_type' => ['sometimes', 'nullable', 'string', 'max:255'],
            'available_from' => ['sometimes', 'nullable', 'date'],
            'tenure' => ['sometimes', 'nullable', 'string', 'max:255'],
            'completion_year' => ['sometimes', 'nullable', 'string', 'max:4'],
            'headline' => ['sometimes', 'nullable', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'has_video' => ['sometimes', 'boolean'],
            'has_virtual_tour' => ['sometimes', 'boolean'],
            'has_floorplan' => ['sometimes', 'boolean'],
            'attributes' => ['sometimes', 'nullable', 'array'],
            'metadata' => ['sometimes', 'nullable', 'array'],
            'location' => ['sometimes', 'array'],
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
