<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\LocationService;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function __construct(
        protected LocationService $locationService
    ) {
    }

    public function suggestions(Request $request)
    {
        $suggestions = $this->locationService->suggestions(
            $request->query('query'),
            $request->integer('limit', 5)
        );

        return response()->json([
            'data' => $suggestions,
        ]);
    }
}
