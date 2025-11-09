<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreListingRequest;
use App\Http\Requests\UpdateListingRequest;
use App\Http\Resources\ListingResource;
use App\Models\Listing;
use App\Services\ListingService;
use Illuminate\Http\Request;

class ListingController extends Controller
{
    public function __construct(
        protected ListingService $listingService
    ) {
    }

    public function index(Request $request)
    {
        $agent = $request->user()?->agent;

        abort_if(! $agent, 403, 'Agent profile not found.');

        $listings = Listing::query()
            ->where('agent_id', $agent->id)
            ->with($this->listingService->defaultRelations())
            ->when($request->query('status'), fn ($query, $status) => $query->where('status', $status))
            ->when($request->query('listing_type'), fn ($query, $type) => $query->where('listing_type', $type))
            ->latest()
            ->paginate($request->integer('per_page', 15));

        return ListingResource::collection($listings);
    }

    public function store(StoreListingRequest $request)
    {
        $agent = $request->user()?->agent;

        abort_if(! $agent, 403, 'Agent profile not found.');

        $payload = $request->validated();
        $payload['agent_id'] = $agent->id;
        $payload['developer_id'] = $payload['developer_id'] ?? $agent->developer_id;

        $listing = $this->listingService->create($payload);

        return ListingResource::make($listing);
    }

    public function show(Request $request, Listing $listing)
    {
        $this->ensureOwnership($listing, $request);

        $listing->load($this->listingService->defaultRelations());

        return ListingResource::make($listing);
    }

    public function update(UpdateListingRequest $request, Listing $listing)
    {
        $this->ensureOwnership($listing, $request);

        $payload = $request->validated();

        if (! isset($payload['agent_id'])) {
            $payload['agent_id'] = $listing->agent_id;
        }

        $listing = $this->listingService->update($listing, $payload);

        return ListingResource::make($listing);
    }

    public function destroy(Request $request, Listing $listing)
    {
        $this->ensureOwnership($listing, $request);

        $listing->delete();

        return response()->noContent();
    }

    protected function ensureOwnership(Listing $listing, Request $request): void
    {
        $agent = $request->user()?->agent;

        abort_if(! $agent, 403, 'Agent profile not found.');
        abort_if($listing->agent_id !== $agent->id, 403, 'You are not authorized to access this listing.');
    }
}
