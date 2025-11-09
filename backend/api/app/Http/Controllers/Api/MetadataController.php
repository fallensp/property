<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PropertyTypeResource;
use App\Models\PropertyType;

class MetadataController extends Controller
{
    public function propertyTypes()
    {
        $types = PropertyType::query()
            ->with(['subTypes.unitTypes'])
            ->orderBy('name')
            ->get();

        return PropertyTypeResource::collection($types);
    }
}
