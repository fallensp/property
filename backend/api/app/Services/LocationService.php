<?php

namespace App\Services;

use App\Models\ListingLocation;
use Illuminate\Http\Client\Factory as HttpFactory;
use Illuminate\Support\Collection;

class LocationService
{
    public function __construct(
        protected HttpFactory $http
    ) {
    }

    /**
     * Fetch suggestions either from Google Places or fall back to known listing locations.
     *
     * @return array<int, array<string, mixed>>
     */
    public function suggestions(?string $query, int $limit = 5): array
    {
        $query = trim((string) $query);

        if ($query === '') {
            return $this->listingFallback($limit)->values()->all();
        }

        $apiKey = config('services.google.maps.key');

        if ($apiKey) {
            $payload = $this->fetchGooglePlaces($query, $limit, $apiKey);
            if ($payload !== null) {
                return $payload;
            }
        }

        return $this->listingFallback($limit, $query)->values()->all();
    }

    /**
     * @return array<int, array<string, mixed>>|null
     */
    protected function fetchGooglePlaces(string $query, int $limit, string $apiKey): ?array
    {
        $response = $this->http->get('https://maps.googleapis.com/maps/api/place/textsearch/json', [
            'query' => $query,
            'key' => $apiKey,
            'region' => 'my',
        ]);

        if (! $response->successful()) {
            return null;
        }

        $results = $response->json('results', []);

        if (! is_array($results)) {
            return null;
        }

        return collect($results)
            ->take($limit)
            ->map(function (array $result): array {
                $location = $result['geometry']['location'] ?? [];

                return [
                    'development_name' => $result['name'] ?? null,
                    'address' => $result['formatted_address'] ?? null,
                    'latitude' => $location['lat'] ?? null,
                    'longitude' => $location['lng'] ?? null,
                    'google_place_id' => $result['place_id'] ?? null,
                    'google_types' => $result['types'] ?? [],
                ];
            })
            ->all();
    }

    /**
     * @return Collection<int, array<string, mixed>>
     */
    protected function listingFallback(int $limit, ?string $query = null): Collection
    {
        return ListingLocation::query()
            ->when($query, function ($builder) use ($query) {
                $builder->where(function ($queryBuilder) use ($query) {
                    $queryBuilder
                        ->where('development_name', 'ilike', "%{$query}%")
                        ->orWhere('city', 'ilike', "%{$query}%")
                        ->orWhere('state', 'ilike', "%{$query}%");
                });
            })
            ->limit($limit)
            ->get([
                'development_name',
                'address_line1',
                'city',
                'state',
                'latitude',
                'longitude',
                'google_place_id',
            ])
            ->map(function (ListingLocation $location): array {
                return [
                    'development_name' => $location->development_name,
                    'address' => $location->address_line1,
                    'city' => $location->city,
                    'state' => $location->state,
                    'latitude' => $location->latitude,
                    'longitude' => $location->longitude,
                    'google_place_id' => $location->google_place_id,
                ];
            });
    }
}
