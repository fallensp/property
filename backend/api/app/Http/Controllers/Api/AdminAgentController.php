<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Agent;
use App\Models\User;
use App\Services\WatermarkService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminAgentController extends Controller
{
    public function __construct(
        protected WatermarkService $watermarkService,
    ) {
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        abort_if(! $user || ($user->id !== 1 && $user->role !== 'admin'), 403, 'Forbidden');

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'full_name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'developer_id' => ['nullable', 'string', 'max:255'],
        ]);

        /** @var Agent $agent */
        $agent = DB::transaction(function () use ($data): Agent {
            /** @var User $newUser */
            $newUser = User::query()->create([
                'name' => $data['name'],
                'email' => $data['email'],
                'role' => 'user',
                'password' => Hash::make($data['password']),
            ]);

            /** @var Agent $agent */
            $agent = Agent::query()->create([
                'user_id' => $newUser->id,
                'developer_id' => $data['developer_id'] ?? null,
                'full_name' => $data['full_name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'status' => 'active',
            ]);

            return $agent;
        });

        $watermarkUrl = $this->watermarkService->generateAgentWatermark($agent);

        return response()->json([
            'message' => 'Agent created',
            'agent' => [
                'id' => $agent->id,
                'full_name' => $agent->full_name,
                'email' => $agent->email,
                'phone' => $agent->phone,
                'developer_id' => $agent->developer_id,
                'user_id' => $agent->user_id,
                'watermark_url' => $watermarkUrl,
            ],
        ], 201);
    }

    public function update(Request $request, Agent $agent): JsonResponse
    {
        $user = $request->user();
        abort_if(! $user || ($user->id !== 1 && $user->role !== 'admin'), 403, 'Forbidden');

        $data = $request->validate([
            'full_name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255'],
            'phone' => ['sometimes', 'string', 'max:50'],
            'developer_id' => ['sometimes', 'string', 'max:255', 'nullable'],
        ]);

        DB::transaction(function () use ($agent, $data): void {
            if (isset($data['email'])) {
                $agent->user?->update(['email' => $data['email']]);
            }

            $agent->fill([
                'full_name' => $data['full_name'] ?? $agent->full_name,
                'email' => $data['email'] ?? $agent->email,
                'phone' => $data['phone'] ?? $agent->phone,
                'developer_id' => $data['developer_id'] ?? $agent->developer_id,
            ]);
            $agent->save();
        });

        $watermarkUrl = $this->watermarkService->generateAgentWatermark($agent);

        return response()->json([
            'message' => 'Agent updated',
            'agent' => [
                'id' => $agent->id,
                'full_name' => $agent->full_name,
                'email' => $agent->email,
                'phone' => $agent->phone,
                'developer_id' => $agent->developer_id,
                'user_id' => $agent->user_id,
                'watermark_url' => $watermarkUrl,
            ],
        ]);
    }

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        abort_if(! $user || ($user->id !== 1 && $user->role !== 'admin'), 403, 'Forbidden');

        $agents = Agent::query()
            ->with('user')
            ->latest()
            ->paginate($request->integer('per_page', 50));

        $data = $agents->getCollection()->map(function (Agent $agent) {
            $watermarkUrl = $this->watermarkService->generateAgentWatermark($agent);
            return [
                'id' => $agent->id,
                'full_name' => $agent->full_name,
                'email' => $agent->email,
                'phone' => $agent->phone,
                'developer_id' => $agent->developer_id,
                'user_id' => $agent->user_id,
                'status' => $agent->status,
                'user_name' => $agent->user?->name,
                'watermark_url' => $watermarkUrl,
            ];
        })->values();

        return response()->json([
            'data' => $data,
            'meta' => [
                'total' => $agents->total(),
                'per_page' => $agents->perPage(),
                'current_page' => $agents->currentPage(),
                'last_page' => $agents->lastPage(),
            ],
        ]);
    }

    public function show(Request $request, Agent $agent): JsonResponse
    {
        $user = $request->user();
        abort_if(! $user || ($user->id !== 1 && $user->role !== 'admin'), 403, 'Forbidden');

        $agent->loadMissing('user');
        $watermarkUrl = $this->watermarkService->generateAgentWatermark($agent);

        return response()->json([
            'agent' => [
                'id' => $agent->id,
                'full_name' => $agent->full_name,
                'email' => $agent->email,
                'phone' => $agent->phone,
                'developer_id' => $agent->developer_id,
                'user_id' => $agent->user_id,
                'user_name' => $agent->user?->name,
                'status' => $agent->status,
                'watermark_url' => $watermarkUrl,
            ],
        ]);
    }
}
