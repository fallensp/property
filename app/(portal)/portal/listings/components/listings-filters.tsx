"use client";

import { useState } from "react";
import { LayoutGrid, List, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  CATEGORY_OPTIONS,
  LISTING_TYPE_OPTIONS,
  MORE_FILTERS,
  PROPERTY_TYPE_OPTIONS,
  SORT_OPTIONS,
  UNIT_TYPE_OPTIONS,
} from "../constants";
import type {
  FilterState,
  MoreFilterState,
  SortValue,
  ViewMode,
} from "../hooks/use-listings-filter";

interface ListingsFiltersProps {
  filters: FilterState;
  viewMode: ViewMode;
  onUpdateFilter: (key: keyof FilterState, value: string | SortValue) => void;
  onToggleMore: (key: keyof MoreFilterState) => void;
  onResetFilters: () => void;
  onViewModeChange: (mode: ViewMode) => void;
}

export function ListingsFilters({
  filters,
  viewMode,
  onUpdateFilter,
  onToggleMore,
  onResetFilters,
  onViewModeChange,
}: ListingsFiltersProps) {
  const [moreValue, setMoreValue] = useState<string | undefined>(undefined);

  const renderSelect = (
    label: string,
    value: string,
    options: { label: string; value: string }[],
    key: keyof FilterState,
  ) => (
    <Select
      value={value}
      onValueChange={(val) => onUpdateFilter(key, val)}
    >
      <SelectTrigger aria-label={label}>
        <SelectValue placeholder={label}>
          {options.find((option) => option.value === value)?.label ?? label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by township, postcode, state, city, building name, street, address, ID or listing reference number"
          value={filters.searchTerm}
          onChange={(event) => onUpdateFilter("searchTerm", event.target.value)}
          className="pl-10"
          aria-label="Search listings"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => onViewModeChange("list")}
            aria-label="List view"
          >
            <List className="h-4 w-4" aria-hidden />
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => onViewModeChange("grid")}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" aria-hidden />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={filters.sort}
            onValueChange={(value) => onUpdateFilter("sort", value)}
          >
            <SelectTrigger className="w-[220px]" aria-label="Sort listings">
              <SelectValue>
                {
                  SORT_OPTIONS.find((option) => option.value === filters.sort)
                    ?.label
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="ghost" onClick={onResetFilters}>
            Clear filters
          </Button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {renderSelect(
          "Listing type",
          filters.listingType,
          LISTING_TYPE_OPTIONS,
          "listingType",
        )}
        {renderSelect(
          "Category",
          filters.category,
          CATEGORY_OPTIONS,
          "category",
        )}
        {renderSelect(
          "Property type",
          filters.propertyType,
          PROPERTY_TYPE_OPTIONS,
          "propertyType",
        )}
        {renderSelect(
          "Unit type",
          filters.unitType,
          UNIT_TYPE_OPTIONS,
          "unitType",
        )}
        <Select
          value={moreValue}
          onValueChange={(value) => {
            const target = value as keyof MoreFilterState;
            onToggleMore(target);
            setMoreValue(undefined);
          }}
        >
          <SelectTrigger aria-label="More filters">
            <SelectValue placeholder="More filters">
              More filters
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {MORE_FILTERS.map((option) => {
              const active = filters.more[option.value as keyof MoreFilterState];
              return (
                <SelectItem key={option.value} value={option.value}>
                  {active ? "✓ " : ""}
                  {option.label}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-2">
        {MORE_FILTERS.map((option) => {
          const key = option.value as keyof MoreFilterState;
          const active = filters.more[key];
          return (
            <Button
              key={option.value}
              variant={active ? "default" : "outline"}
              size="sm"
              onClick={() => onToggleMore(key)}
            >
              {option.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
