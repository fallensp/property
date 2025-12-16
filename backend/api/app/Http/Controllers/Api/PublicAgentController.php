<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Agent;
use App\Services\WatermarkService;
use Illuminate\Http\JsonResponse;

class PublicAgentController extends Controller
{
    public function __construct(
        protected WatermarkService $watermarkService
    ) {
    }

    public function watermark(Agent $agent): JsonResponse
    {
        $url = $this->watermarkService->generateAgentWatermark($agent);

        return response()->json([
            'agent_id' => $agent->id,
            'url' => $url,
        ]);
    }
}
