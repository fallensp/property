# Data Model: Listing Creation Frontend

## Entities

### ListingDraft
| Field | Type | Source | Validation/Notes |
|-------|------|--------|------------------|
| `id` | string | Generated client-side | UUID v4 used for mock persistence |
| `propertyCategory` | `"residential" \| "commercial" \| "industrial"` | Step 1 | Required; determines helper copy in summary |
| `listingPurpose` | `"sale" \| "rent"` | Step 1 | Required; locked before publish |
| `referenceNumber` | string | Step 1 | Optional; max 250 chars |
| `location` | `LocationSelection` | Step 2 | Required; derived from mock dataset |
| `unitDetails` | `UnitDetails` | Step 3 | Required subset for bedrooms/bathrooms/builtUp |
| `pricing` | `Pricing` | Step 4 | Requires positive `sellingPrice` |
| `headline` | string | Step 5 | Required; 10–70 characters |
| `description` | string | Step 5 | Required; ≥ 20 words, ≤ 2000 characters |
| `media` | `MediaCollection` | Step 6 | Must contain ≥5 photos |
| `platformSettings` | `PlatformSettings` | Step 7 | Toggles persisted for preview |
| `validation` | `Record<WizardStep, StepStatus>` | Derived | Tracks `complete`, `incomplete`, `blocked` states per step |
| `updatedAt` | ISO string | System | Updated on any field mutation |

### LocationSelection
| Field | Type | Validation/Notes |
|-------|------|------------------|
| `searchTerm` | string | Reflects user input; used for analytics and fallback messaging |
| `developmentName` | string | Required; chosen suggestion |
| `address` | string | Optional; displayed in preview |
| `latitude` | number | Optional; used for map pin |
| `longitude` | number | Optional; used for map pin |
| `propertyType` | string | Required; derived from selection |
| `propertySubType` | string | Required when available |
| `propertyUnitType` | string | Required when available |
| `state`, `city`, `street`, `postalCode` | string | Optional metadata rendered in summary |
| `tenure`, `completionYear`, `titleType` | string | Optional metadata rendered in summary |
| `leaseYearsRemaining` | string | Optional numeric input |
| `bumiLot` | string | Optional; defaults to `Do not specify` |

### UnitDetails
| Field | Type | Validation/Notes |
|-------|------|------------------|
| `bedrooms` | number | Required; ≥0 integer |
| `bathrooms` | number | Required; ≥0 integer |
| `maidRooms` | number | Optional; ≥0 integer |
| `builtUp` | number | Required; >0 |
| `builtUpWidth` | number \| null | Optional; >0 when provided |
| `builtUpLength` | number \| null | Optional; >0 when provided |
| `block` | string \| null | Optional; trimmed, max 20 chars |
| `floor` | string \| null | Optional; trimmed, max 20 chars |
| `unitNumber` | string \| null | Optional; trimmed, max 20 chars |
| `hideLocationDetails` | boolean | Defaults to `false` |
| `parkingSpots` | number \| null | Optional; ≥0 integer |
| `furnishing` | `"fully" \| "partial" \| "unfurnished"` | Required |
| `features` | string[] | Optional multi-select chips |

### Pricing
| Field | Type | Validation/Notes |
|-------|------|------------------|
| `priceType` | `"none" \| "negotiable" \| "fixed" \| "poa"` | Defaults to `"none"` |
| `sellingPrice` | number | Required; >0 |
| `maintenanceFee` | number \| null | Optional; ≥0 |
| `pricePerSqft` | number \| null | Optional; auto-calculated but editable |

### MediaCollection
| Field | Type | Validation/Notes |
|-------|------|------------------|
| `photos` | `MediaAsset[]` | Must contain ≥5 items; order matters |
| `videos` | `MediaAsset[]` | Optional |
| `floorplans` | `MediaAsset[]` | Optional |
| `virtualTours` | `MediaAsset[]` | Optional |
| `projectPhotos` | `MediaAsset[]` | Optional pre-loaded resources |

### MediaAsset
| Field | Type | Validation/Notes |
|-------|------|------------------|
| `id` | string | UUID |
| `type` | `"photo" \| "video" \| "floorplan" \| "virtualTour"` | Required |
| `fileName` | string | Display name |
| `url` | string | Object URL or placeholder asset |
| `thumbnailUrl` | string | Pre-generated or derived |
| `sizeBytes` | number | Used for validation copy |
| `altText` | string | Required for accessibility when type is photo |
| `order` | number | Zero-based ordering |

### PlatformSettings
| Field | Type | Validation/Notes |
|-------|------|------------------|
| `publishIProperty` | boolean | Defaults to `true`; required toggle |
| `publishPropertyGuru` | boolean | Defaults to `false`; hidden if not subscribed (mock flag) |
| `boost` | boolean | Optional |
| `scheduledPublish` | boolean | Defaults to `false` |
| `scheduledDate` | ISO string \| null | Required when `scheduledPublish` true, must be in future |

### WizardStep & StepStatus
| Field | Type | Validation/Notes |
|-------|------|------------------|
| `WizardStep` | enum (`listingType`, `location`, `unitDetails`, `price`, `description`, `gallery`, `platform`, `preview`) | Defines ordering |
| `StepStatus` | `"not-started" \| "in-progress" \| "complete" \| "blocked"` | Controls sidebar iconography and gating |

## Relationships & State Transitions
- `ListingDraft` aggregates subordinate entities; Zustand store persists draft data and exposes selectors per step.
- Step transitions update `validation` map:
  - On field edit, mark current step `in-progress`.
  - On validation pass, set `complete` and unlock next step.
  - On validation failure, set `blocked` with error references for UI surface.
- Media reorder operations adjust `MediaAsset.order`; preview relies on sorted order to determine hero image.
- Platform scheduling toggles drive conditional validation on `scheduledDate` to prevent empty future scheduling.

## Derived Data
- `pricePerSqft` recalculates on `sellingPrice` or `builtUp` change when auto-calculation toggled.
- Map preview uses `location.latitude/longitude`; when absent, fallback to static screenshot and display manual confirmation prompt.
- Progress sidebar computes completion ratio by counting `validation[step] === "complete"`.
