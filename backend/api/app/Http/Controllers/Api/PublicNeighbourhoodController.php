<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Neighbourhood;
use Illuminate\Http\JsonResponse;

class PublicNeighbourhoodController extends Controller
{
    public function index(): JsonResponse
    {
        $neighbourhoods = Neighbourhood::query()
            ->withCount(['listings' => function ($query) {
                $query->where('status', 'online');
            }])
            ->orderBy('name')
            ->get();

        $data = $neighbourhoods->map(function (Neighbourhood $neighbourhood) {
            return [
                'id' => $neighbourhood->id,
                'name' => $neighbourhood->name,
                'image_url' => $neighbourhood->image_url,
                'listings_count' => $neighbourhood->listings_count,
                'created_at' => $neighbourhood->created_at->toISOString(),
                'updated_at' => $neighbourhood->updated_at->toISOString(),
            ];
        })->values();

        return response()->json([
            'data' => $data,
        ]);
    }
}
