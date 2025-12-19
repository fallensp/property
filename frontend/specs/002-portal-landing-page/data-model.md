# Data Model: Portal Listings Landing

## ListingSummary
- **Purpose**: Represents the visible card shown in the Listings table.
- **Fields**:
  - `id` (string) — Unique identifier for the listing (IPP/PG ID).
  - `title` (string) — Property name displayed as primary link.
  - `address` (string) — Street and locality text.
  - `price` (string) — Preformatted currency display.
  - `badges` (Array\<Badge\>) — Status indicators (e.g., Premium, Buy, Bungalow).
  - `attributes` (Array\<Attribute\>) — Icon + label pairs (beds, baths, size).
  - `metrics` (ListingMetrics) — Engagement stats (impressions, page views, enquiries).
  - `rotationInfo` (string) — Next rotation text shown in card footer.
  - `visibility` (string) — Visibility label (“1st page”, “Low”, etc.).
  - `expiryCopy` (string) — Upgrade/expiry status messaging.
  - `thumbnailUrl` (string) — Image shown on the left of the card.
  - `status` (ListingStatus) — One of Online, Draft, Offline, Expired (drives tab).

## Badge
- `label` (string) — Text inside the badge.
- `variant` (string) — Visual variant (premium, standard, info).

## Attribute
- `icon` (string) — Icon identifier for the attribute.
- `label` (string) — Text displayed alongside the icon (e.g., “6+1”).

## ListingMetrics
- `impressions` (number) — Impression count.
- `pageViews` (number) — Page view count.
- `enquiries` (number) — Enquiry count.

## FilterState
- `searchTerm` (string) — Free text filter.
- `listingType` (string | null) — Selected listing type (Buy/Rent, etc.).
- `category` (string | null) — Category filter.
- `propertyType` (string | null) — Property type filter.
- `upgrade` (string | null) — Upgrade filter.
- `unitType` (string | null) — Unit type filter.
- `more` (Record\<string, string | boolean\>) — Additional filters from the “More” dropdown.
- `sort` (string) — Active sort option (default “Listed (New to old)”).
- `statusTab` (ListingStatus) — Active status tab.

## ListingStatus (enum)
- Values: `online`, `draft`, `offline`, `expired`.

## UIState
- `isLoading` (boolean) — Indicates whether mock data is being fetched/filtered.
- `viewMode` (string) — “list” or “grid” icon selection (grid toggle included in UI).
- `bulkActionOpen` (boolean) — Controls the “More actions” dropdown state.

## Derived Collections
- **FilteredListings**: Result of applying `FilterState` to the `ListingSummary` dataset.
- **StatusBuckets**: Aggregated counts per `ListingStatus` to render tab labels.
