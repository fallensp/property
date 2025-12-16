<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ListingResource;
use App\Models\Listing;
use App\Services\ListingService;
use Illuminate\Http\Request;

class PublicListingController extends Controller
{
    public function __construct(
        protected ListingService $listingService,
    ) {
    }

    public function index(Request $request)
    {
        $listings = Listing::query()
            ->where('status', 'online')
            ->with($this->listingService->defaultRelations())
            ->when($request->query('category'), fn ($query, $category) => $query->where('category', $category))
            ->when($request->query('listing_type'), fn ($query, $type) => $query->where('listing_type', $type))
            ->when($request->query('property_type'), function ($query, $type) {
                $query->whereHas('propertyType', fn ($q) => $q->where('name', $type));
            })
            ->when($request->query('property_sub_type'), function ($query, $type) {
                $query->whereHas('propertySubType', fn ($q) => $q->where('name', $type));
            })
            ->when($request->query('property_unit_type'), function ($query, $type) {
                $query->whereHas('propertyUnitType', fn ($q) => $q->where('name', $type));
            })
            ->when($request->query('min_price'), fn ($query, $price) => $query->where('price_value', '>=', (int) $price))
            ->when($request->query('max_price'), fn ($query, $price) => $query->where('price_value', '<=', (int) $price))
            ->when($request->query('availability'), function ($query, $mode) {
                $query->where(function ($q) use ($mode) {
                    if ($mode === 'immediate') {
                        $q->whereNull('available_from')
                            ->orWhere('metadata->availability_mode', 'immediate');
                    } else {
                        $q->whereNotNull('available_from')
                            ->orWhere('metadata->availability_mode', 'scheduled');
                    }
                });
            })
            ->when($request->query('furnishing'), function ($query, $furnishing) {
                $query->where('attributes->furnishing', $furnishing);
            })
            ->latest()
            ->paginate($request->integer('per_page', 15));

        return ListingResource::collection($listings);
    }

    public function show(Listing $listing)
    {
        abort_if($listing->status !== 'online', 404);

        $listing->load($this->listingService->defaultRelations());

        return ListingResource::make($listing);
    }
}
