<?php

namespace App\Services;

use App\Models\Listing;
use App\Models\ListingLocation;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class ListingService
{
    /**
     * @param  array<string, mixed>  $payload
     */
    public function create(array $payload): Listing
    {
        return DB::transaction(function () use ($payload): Listing {
            $locationData = Arr::pull($payload, 'location', []);

            /** @var Listing $listing */
            $listing = Listing::query()->create($payload);

            if (! empty($locationData)) {
                $this->upsertLocation($listing, $locationData);
            }

            return $listing->load($this->defaultRelations());
        });
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    public function update(Listing $listing, array $payload): Listing
    {
        return DB::transaction(function () use ($listing, $payload): Listing {
            $locationData = Arr::pull($payload, 'location', null);

            $listing->fill($payload);
            $listing->save();

            if (is_array($locationData)) {
                $this->upsertLocation($listing, $locationData);
            }

            return $listing->load($this->defaultRelations());
        });
    }

    /**
     * @return array<int, string>
     */
    public function defaultRelations(): array
    {
        return [
            'agent',
            'developer',
            'propertyType',
            'propertySubType',
            'propertyUnitType',
            'location',
        ];
    }

    /**
     * @param  array<string, mixed>  $locationData
     */
    protected function upsertLocation(Listing $listing, array $locationData): void
    {
        /** @var ListingLocation $location */
        $location = $listing->location()->firstOrNew();
        $location->fill($locationData);
        $listing->location()->save($location);
    }
}
