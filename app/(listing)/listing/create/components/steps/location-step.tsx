"use client";

import { useEffect, useMemo, useState } from "react";
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
import { fetchLocationSuggestions } from "@/lib/api/locations";
import { usePropertyMetadataStore } from "@/lib/stores/property-metadata-store";
import type { LocationSuggestion } from "@/lib/api/types";

type StepProps = {
  errors: Record<string, string>;
};

const TITLE_TYPES = ["Individual", "Strata", "Master"];
const TENURE_OPTIONS = ["Freehold", "Leasehold"];
const BUMI_OPTIONS = ["Do not specify", "Yes", "No"];

export function LocationStep({ errors }: StepProps) {
  const { draft, updateLocation, updateLocationFields, updateListingType, resolvePropertyTypeIds } = useListingStore(
    (state) => ({
      draft: state.draft,
      updateLocation: state.updateLocation,
      updateLocationFields: state.updateLocationFields,
      updateListingType: state.updateListingType,
      resolvePropertyTypeIds: state.resolvePropertyTypeIds
    })
  );

  const location = draft.location ?? ({} as Partial<LocationSelection>);

  const [searchTerm, setSearchTerm] = useState(location.searchTerm ?? "");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const propertyTypes = usePropertyMetadataStore((state) => state.propertyTypes);
  const metadataStatus = usePropertyMetadataStore((state) => state.status);
  const fetchMetadata = usePropertyMetadataStore((state) => state.fetchMetadata);
  const isUpdateMode = useListingStore((state) => state.isUpdateMode);

  useEffect(() => {
    fetchMetadata();
  }, [fetchMetadata]);

  // Resolve property type IDs when metadata is loaded in update mode
  useEffect(() => {
    if (isUpdateMode && propertyTypes.length > 0 && location.propertyType) {
      resolvePropertyTypeIds(propertyTypes);
    }
  }, [isUpdateMode, propertyTypes, location.propertyType, resolvePropertyTypeIds]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 350);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [searchTerm]);

  useEffect(() => {
    let active = true;
    setIsSearching(true);
    setSearchError(null);
    fetchLocationSuggestions(debouncedSearchTerm || undefined)
      .then((data) => {
        if (!active) return;
        setSuggestions(data);
      })
      .catch((error) => {
        if (!active) return;
        setSearchError(
          error instanceof Error
            ? error.message
            : "Unable to fetch location suggestions.",
        );
      })
      .finally(() => {
        if (active) {
          setIsSearching(false);
        }
      });

    return () => {
      active = false;
    };
  }, [debouncedSearchTerm]);

  const selectedPropertyType = useMemo(
    () => propertyTypes.find((type) => type.id === location.propertyTypeId),
    [location.propertyTypeId, propertyTypes],
  );

  const availableSubTypes = useMemo(
    () => selectedPropertyType?.sub_types ?? [],
    [selectedPropertyType],
  );

  const selectedSubType = useMemo(
    () =>
      availableSubTypes.find(
        (subType) => subType.id === location.propertySubTypeId,
      ) ?? availableSubTypes[0],
    [availableSubTypes, location.propertySubTypeId],
  );

  const availableUnitTypes = useMemo(
    () => selectedSubType?.unit_types ?? [],
    [selectedSubType],
  );

  const handleSelect = (selection: LocationSuggestion) => {
    const developmentName = selection.development_name ?? "";
    const nextSearchTerm = developmentName || searchTerm;
    updateLocation({
      searchTerm: nextSearchTerm,
      developmentName,
      address: selection.address ?? "",
      latitude: selection.latitude,
      longitude: selection.longitude,
      state: selection.state ?? "",
      city: selection.city ?? "",
      street: selection.address ?? "",
      postalCode: "",
      tenure: location.tenure,
      completionYear: location.completionYear,
      titleType: location.titleType,
      bumiLot: location.bumiLot ?? "Do not specify"
    });
    setSearchTerm(nextSearchTerm);
    if (!draft.propertyName) {
      updateListingType({ propertyName: nextSearchTerm || draft.propertyName });
    }
  };

  const mapFallbackText = location.developmentName
    ? `Map preview for ${location.developmentName}`
    : isSearching
      ? "Searching for matching developments..."
      : "Select a location to preview the map";

  const handlePropertyTypeChange = (value: string) => {
    const typeId = Number(value);
    const matched = propertyTypes.find((type) => type.id === typeId);
    const subTypes = matched?.sub_types ?? [];
    const firstSubType = subTypes[0];
    const unitTypes = firstSubType?.unit_types ?? [];
    updateLocationFields({
      propertyTypeId: matched?.id,
      propertyType: matched?.name ?? "",
      propertySubTypeId: firstSubType?.id,
      propertySubType: firstSubType?.name ?? "",
      propertyUnitTypeId: unitTypes[0]?.id,
      propertyUnitType: unitTypes[0]?.name ?? ""
    });
  };

  const handlePropertySubTypeChange = (value: string) => {
    const subTypeId = Number(value);
    const subType = availableSubTypes.find((item) => item.id === subTypeId);
    const unitTypes = subType?.unit_types ?? [];
    updateLocationFields({
      propertySubTypeId: subType?.id,
      propertySubType: subType?.name ?? "",
      propertyUnitTypeId: unitTypes[0]?.id,
      propertyUnitType: unitTypes[0]?.name ?? ""
    });
  };

  const handlePropertyUnitTypeChange = (value: string) => {
    const unitTypeId = Number(value);
    const unitType = availableUnitTypes.find((item) => item.id === unitTypeId);
    updateLocationFields({
      propertyUnitTypeId: unitType?.id,
      propertyUnitType: unitType?.name ?? "",
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
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
              {suggestions.map((suggestion, index) => {
                const developmentName = suggestion.development_name ?? "Unknown development";
                const selected =
                  location.developmentName === developmentName;
                const key =
                  suggestion.google_place_id ??
                  `${developmentName}-${suggestion.address}-${index}`;
                return (
                  <button
                    key={key}
                    type="button"
                    data-testid={`location-option-${developmentName}`}
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
                      {developmentName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {suggestion.address ?? suggestion.city ?? suggestion.state ?? "Address unavailable"}
                    </p>
                  </button>
                );
              })}
              {isSearching ? (
                <div className="rounded-xl border border-dashed border-border bg-muted/40 p-6 text-sm text-muted-foreground">
                  Fetching locations…
                </div>
              ) : suggestions.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-muted/40 p-6 text-sm text-muted-foreground">
                  No results found. Try a different search term.
                </div>
              ) : null}
            </div>
            {searchError ? (
              <p className="text-sm text-destructive">{searchError}</p>
            ) : null}
          </div>

          <div className="grid gap-8 rounded-xl border border-border bg-background p-6 lg:p-8">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-2 lg:col-span-2">
                <Label htmlFor="property-type">Property type *</Label>
                <Select
                  value={
                    location.propertyTypeId ? String(location.propertyTypeId) : ""
                  }
                  onValueChange={handlePropertyTypeChange}
                  disabled={metadataStatus === "loading"}
                >
                  <SelectTrigger
                    id="property-type"
                    data-testid="property-type-select"
                  >
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type.id} value={String(type.id)}>
                        {type.name}
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
                  value={
                    location.propertySubTypeId
                      ? String(location.propertySubTypeId)
                      : ""
                  }
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
                      <SelectItem key={subType.id} value={String(subType.id)}>
                        {subType.name}
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
                  value={
                    location.propertyUnitTypeId
                      ? String(location.propertyUnitTypeId)
                      : ""
                  }
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
                      <SelectItem key={unitType.id} value={String(unitType.id)}>
                        {unitType.name}
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

            {metadataStatus === "error" ? (
              <p className="text-sm text-destructive">
                Unable to load property metadata. Please refresh this page.
              </p>
            ) : null}

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

            <div className="space-y-6">
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
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Tenure
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {location.tenure ?? "—"}
                  </p>
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
        </aside>
      </section>
    </div>
  );
}
