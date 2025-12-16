<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Neighbourhood;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminNeighbourhoodController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        abort_if(! $user || ($user->id !== 1 && $user->role !== 'admin'), 403, 'Forbidden');

        $neighbourhoods = Neighbourhood::query()
            ->withCount('listings')
            ->latest()
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

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        abort_if(! $user || ($user->id !== 1 && $user->role !== 'admin'), 403, 'Forbidden');

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'image' => ['nullable', 'image', 'max:5120'], // 5MB max
        ]);

        $imageUrl = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('neighbourhoods', 'public');
            $imageUrl = Storage::disk('public')->url($path);
        }

        $neighbourhood = Neighbourhood::create([
            'name' => $data['name'],
            'image_url' => $imageUrl,
        ]);

        return response()->json([
            'data' => [
                'id' => $neighbourhood->id,
                'name' => $neighbourhood->name,
                'image_url' => $neighbourhood->image_url,
                'listings_count' => 0,
                'created_at' => $neighbourhood->created_at->toISOString(),
                'updated_at' => $neighbourhood->updated_at->toISOString(),
            ],
        ], 201);
    }

    public function show(Request $request, Neighbourhood $neighbourhood): JsonResponse
    {
        $user = $request->user();
        abort_if(! $user || ($user->id !== 1 && $user->role !== 'admin'), 403, 'Forbidden');

        $neighbourhood->loadCount('listings');

        return response()->json([
            'data' => [
                'id' => $neighbourhood->id,
                'name' => $neighbourhood->name,
                'image_url' => $neighbourhood->image_url,
                'listings_count' => $neighbourhood->listings_count,
                'created_at' => $neighbourhood->created_at->toISOString(),
                'updated_at' => $neighbourhood->updated_at->toISOString(),
            ],
        ]);
    }

    public function update(Request $request, Neighbourhood $neighbourhood): JsonResponse
    {
        $user = $request->user();
        abort_if(! $user || ($user->id !== 1 && $user->role !== 'admin'), 403, 'Forbidden');

        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'image' => ['nullable', 'image', 'max:5120'],
        ]);

        if (isset($data['name'])) {
            $neighbourhood->name = $data['name'];
        }

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($neighbourhood->image_url) {
                $oldPath = str_replace(Storage::disk('public')->url(''), '', $neighbourhood->image_url);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('image')->store('neighbourhoods', 'public');
            $neighbourhood->image_url = Storage::disk('public')->url($path);
        }

        $neighbourhood->save();
        $neighbourhood->loadCount('listings');

        return response()->json([
            'data' => [
                'id' => $neighbourhood->id,
                'name' => $neighbourhood->name,
                'image_url' => $neighbourhood->image_url,
                'listings_count' => $neighbourhood->listings_count,
                'created_at' => $neighbourhood->created_at->toISOString(),
                'updated_at' => $neighbourhood->updated_at->toISOString(),
            ],
        ]);
    }

    public function destroy(Request $request, Neighbourhood $neighbourhood): JsonResponse
    {
        $user = $request->user();
        abort_if(! $user || ($user->id !== 1 && $user->role !== 'admin'), 403, 'Forbidden');

        // Delete image if exists
        if ($neighbourhood->image_url) {
            $oldPath = str_replace(Storage::disk('public')->url(''), '', $neighbourhood->image_url);
            Storage::disk('public')->delete($oldPath);
        }

        $neighbourhood->delete();

        return response()->json([
            'message' => 'Neighbourhood deleted',
        ]);
    }
}
