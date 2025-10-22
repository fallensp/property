"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  useListingStore,
  type LocationSelection
} from "@/app/(listing)/listing/create/state/listing-store";
import {
  mockLocations,
  searchLocations,
  type MockLocation
} from "@/lib/mock-data/locations";

type StepProps = {
  errors: Record<string, string>;
};

const PROPERTY_TYPES_CONFIG = [
  {
    type: "Bungalow / Villa",
    subTypes: [
      "Bungalow",
      "Zero-Lot Bungalow",
      "Link Bungalow",
      "Bungalow Land",
      "Twin Villas"
    ]
  },
  {
    type: "Apartment / Condo / Service Residence",
    subTypes: ["Flat", "Apartment", "Service Residence", "Condominium"]
  },
  {
    type: "Semi-Detached House",
    subTypes: ["Semi-Detached House", "Cluster House"]
  },
  {
    type: "Terrace / Link House",
    subTypes: [
      "Terraced House",
      "1-storey Terraced House",
      "1.5-storey Terraced House",
      "2-storey Terrace House",
      "2.5-storey Terraced House",
      "3-storey Terraced House",
      "3.5-storey Terraced House",
      "4-storey Terraced House",
      "4.5-storey Terraced House",
      "Townhouse"
    ]
  },
  {
    type: "Residential Land",
    subTypes: ["Residential Land"]
  }
] as const;

const PROPERTY_TYPES = PROPERTY_TYPES_CONFIG.map((config) => config.type);

const PROPERTY_SUB_TYPES = PROPERTY_TYPES_CONFIG.reduce<Record<string, string[]>>(
  (acc, config) => {
    acc[config.type] = [...config.subTypes];
    return acc;
  },
  {}
);

const PROPERTY_UNIT_TYPE_BASE = [
  "Intermediate",
  "Corner Lot",
  "End Lot",
  "Duplex",
  "Triplex",
  "Penthouse",
  "Studio",
  "Soho",
  "Loft",
  "Dual Key",
  "Prefer not to say"
];

const PROPERTY_UNIT_TYPES = PROPERTY_TYPES_CONFIG.reduce<Record<string, string[]>>(
  (acc, config) => {
    config.subTypes.forEach((subType) => {
      acc[subType] = [...PROPERTY_UNIT_TYPE_BASE];
    });
    return acc;
  },
  {}
);

const TITLE_TYPES = ["Individual", "Strata", "Master"];
const TENURE_OPTIONS = ["Freehold", "Leasehold"];
const BUMI_OPTIONS = ["Do not specify", "Yes", "No"];

export function LocationStep({ errors }: StepProps) {
  const { draft, updateLocation, updateLocationFields } = useListingStore(
    (state) => ({
      draft: state.draft,
      updateLocation: state.updateLocation,
      updateLocationFields: state.updateLocationFields
    })
  );

  const location = draft.location ?? ({} as Partial<LocationSelection>);

  const [searchTerm, setSearchTerm] = useState(location.searchTerm ?? "");
  const [suggestions, setSuggestions] = useState(mockLocations);

  const availableSubTypes = useMemo(() => {
    return PROPERTY_SUB_TYPES[location.propertyType ?? ""] ?? [];
  }, [location.propertyType]);

  const availableUnitTypes = useMemo(() => {
    return PROPERTY_UNIT_TYPES[location.propertySubType ?? ""] ?? [];
  }, [location.propertySubType]);

  const handleSelect = (selection: MockLocation) => {
    updateLocation({
      searchTerm,
      developmentName: selection.developmentName,
      address: selection.address,
      latitude: selection.latitude,
      longitude: selection.longitude,
      propertyType: selection.propertyType,
      propertySubType: selection.propertySubType,
      propertyUnitType: selection.propertyUnitType,
      state: selection.state,
      city: selection.city,
      street: selection.street,
      postalCode: selection.postalCode,
      tenure: selection.tenure,
      completionYear: selection.completionYear,
      titleType: selection.titleType,
      bumiLot: selection.bumiLot ?? "Do not specify"
    });
  };

  const mapFallbackText = location.developmentName
    ? `Map preview for ${location.developmentName}`
    : "Select a location to preview the map";

  const handlePropertyTypeChange = (value: string) => {
    const subTypes = PROPERTY_SUB_TYPES[value] ?? [];
    const firstSubType = subTypes[0] ?? "";
    const unitTypes = PROPERTY_UNIT_TYPES[firstSubType] ?? [];
    updateLocationFields({
      propertyType: value,
      propertySubType: firstSubType,
      propertyUnitType: unitTypes[0] ?? ""
    });
  };

  const handlePropertySubTypeChange = (value: string) => {
    const unitTypes = PROPERTY_UNIT_TYPES[value] ?? [];
    updateLocationFields({
      propertySubType: value,
      propertyUnitType: unitTypes[0] ?? ""
    });
  };

  const handlePropertyUnitTypeChange = (value: string) => {
    updateLocationFields({ propertyUnitType: value });
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setSuggestions(searchLocations(value));
  };

  return (
    <div className="space-y-10">
      <section className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)] xl:grid-cols-[minmax(0,1.75fr)_minmax(360px,1fr)] lg:items-start">
        <div className="space-y-10">
          <div className="space-y-3">
            <Label htmlFor="location-search" className="text-base font-medium">
              Search development
            </Label>
            <Input
              id="location-search"
              type="search"
              placeholder="Search by property name or address"
              value={searchTerm}
              onChange={(event) => handleSearchChange(event.target.value)}
              aria-describedby={
                errors.developmentName ? "location-error" : undefined
              }
            />
            <p className="text-xs text-muted-foreground">
              Select a suggestion to lock the development for this listing. You
              can refine property details below.
            </p>
            {errors.developmentName ? (
              <p id="location-error" className="text-sm text-destructive">
                {errors.developmentName}
              </p>
            ) : null}
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold text-muted-foreground">
              Suggested locations
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {suggestions.map((suggestion) => {
                const selected =
                  location.developmentName === suggestion.developmentName;
                return (
                  <button
                    key={suggestion.developmentName}
                    type="button"
                    data-testid={`location-option-${suggestion.developmentName}`}
                    onClick={() => handleSelect(suggestion)}
                    className={cn(
                      "rounded-xl border p-4 text-left transition",
                      selected
                        ? "border-primary bg-primary/10"
                        : "border-border bg-background hover:border-primary/40 hover:bg-muted"
                    )}
                    aria-pressed={selected}
                  >
                    <p className="text-base font-semibold text-foreground">
                      {suggestion.developmentName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {suggestion.address}
                    </p>
                  </button>
                );
              })}
              {suggestions.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-muted/40 p-6 text-sm text-muted-foreground">
                  No results found. Try a different search term.
                </div>
              ) : null}
            </div>
          </div>

          <div className="grid gap-8 rounded-xl border border-border bg-background p-6 lg:p-8">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="property-type">Property type *</Label>
                <Select
                  value={location.propertyType ?? ""}
                  onValueChange={handlePropertyTypeChange}
                >
                  <SelectTrigger
                    id="property-type"
                    data-testid="property-type-select"
                  >
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROPERTY_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.propertyType ? (
                  <p className="text-sm text-destructive">{errors.propertyType}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="property-sub-type">Property sub type *</Label>
                <Select
                  value={location.propertySubType ?? ""}
                  onValueChange={handlePropertySubTypeChange}
                  disabled={availableSubTypes.length === 0}
                >
                  <SelectTrigger
                    id="property-sub-type"
                    data-testid="property-sub-type-select"
                  >
                    <SelectValue placeholder="Select property subtype" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSubTypes.map((subType) => (
                      <SelectItem key={subType} value={subType}>
                        {subType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.propertySubType ? (
                  <p className="text-sm text-destructive">
                    {errors.propertySubType}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="property-unit-type">Property unit type *</Label>
                <Select
                  value={location.propertyUnitType ?? ""}
                  onValueChange={handlePropertyUnitTypeChange}
                  disabled={availableUnitTypes.length === 0}
                >
                  <SelectTrigger
                    id="property-unit-type"
                    data-testid="property-unit-type-select"
                  >
                    <SelectValue placeholder="Select unit type" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUnitTypes.map((unitType) => (
                      <SelectItem key={unitType} value={unitType}>
                        {unitType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.propertyUnitType ? (
                  <p className="text-sm text-destructive">
                    {errors.propertyUnitType}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="property-tenure">Tenure</Label>
              <Select
                value={location.tenure ?? ""}
                onValueChange={(value) => updateLocationFields({ tenure: value })}
              >
                <SelectTrigger
                  id="property-tenure"
                  data-testid="property-tenure-select"
                >
                  <SelectValue placeholder="Select tenure" />
                </SelectTrigger>
                <SelectContent>
                  {TENURE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <div className="space-y-2 rounded-xl border border-border bg-background p-6 lg:p-8">
                <h3 className="text-sm font-semibold text-foreground">Address</h3>
                <div className="rounded-lg border border-border/60 bg-muted/40 p-4 text-sm leading-6">
                  <p>
                    <span className="font-medium text-muted-foreground">
                      State:
                    </span>{" "}
                    {location.state ?? "—"}
                  </p>
                  <p>
                    <span className="font-medium text-muted-foreground">
                      City:
                    </span>{" "}
                    {location.city ?? "—"}
                  </p>
                  <p>
                    <span className="font-medium text-muted-foreground">
                      Street:
                    </span>{" "}
                    {location.street ?? "—"}
                  </p>
                  <p>
                    <span className="font-medium text-muted-foreground">
                      Postal code:
                    </span>{" "}
                    {location.postalCode ?? "—"}
                  </p>
                </div>
              </div>

              <div className="space-y-3 rounded-xl border border-border bg-background p-6 lg:p-8">
                <h3 className="text-sm font-semibold text-foreground">
                  Property details
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Tenure
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {location.tenure ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Completion year
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {location.completionYear ?? "—"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Title type">
                  {TITLE_TYPES.map((type) => (
                    <Button
                      key={type}
                      type="button"
                      variant={location.titleType === type ? "default" : "outline"}
                      onClick={() => updateLocationFields({ titleType: type })}
                      data-testid={`title-type-${type.toLowerCase()}`}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="lease-years">
                      Lease years remaining (optional)
                    </Label>
                    <Input
                      id="lease-years"
                      type="number"
                      min={0}
                      placeholder="Enter remaining years"
                      value={location.leaseYearsRemaining ?? ""}
                      onChange={(event) =>
                        updateLocationFields({
                          leaseYearsRemaining: event.target.value
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bumi-lot">
                      Is this a Bumi lot? (optional)
                    </Label>
                    <Select
                      value={location.bumiLot ?? "Do not specify"}
                      onValueChange={(value) =>
                        updateLocationFields({ bumiLot: value })
                      }
                    >
                      <SelectTrigger
                        id="bumi-lot"
                        data-testid="bumi-lot-select"
                      >
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        {BUMI_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="relative h-80 rounded-xl border border-border bg-gradient-to-br from-primary/20 via-muted to-muted/40 p-6">
            <div className="absolute inset-0 flex items-center justify-center text-center text-sm text-muted-foreground">
              {mapFallbackText}
            </div>
            {location.developmentName ? (
              <div className="absolute bottom-6 left-6 rounded-lg bg-background/90 p-4 shadow-lg">
                <p className="text-sm font-semibold text-foreground">
                  {location.developmentName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {location.street ?? location.address}
                </p>
              </div>
            ) : null}
          </div>
          <div className="space-y-3 rounded-xl border border-border bg-background p-6">
            <h4 className="text-sm font-semibold text-foreground">
              Report issue regarding property location
            </h4>
            <p className="text-sm text-muted-foreground">
              Submit an issue form and we&apos;ll help you resolve the location
              as quickly as possible.
            </p>
            <Button variant="outline" className="w-fit">
              Fill in issue form
            </Button>
          </div>
        </aside>
      </section>
    </div>
  );
}
