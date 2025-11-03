"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import { ListingsHeader } from "./components/listings-header";
import { ListingsFilters } from "./components/listings-filters";
import { ListingsTabs } from "./components/listings-tabs";
import { ListingsTable } from "./components/listings-table";
import { useListingsFilter } from "./hooks/use-listings-filter";

export default function PortalListingsPage() {
  const router = useRouter();
  const {
    status,
    setStatus,
    filters,
    updateFilter,
    toggleMoreFilter,
    resetFilters,
    viewMode,
    setViewMode,
    filteredListings,
    statusCounts,
  } = useListingsFilter();

  useEffect(() => {
    router.prefetch("/listing/create");
  }, [router]);

  const handleCreateListing = () => {
    router.push("/listing/create");
  };

  return (
    <main className="flex flex-col gap-6 p-6">
      <ListingsHeader
        onCreateListing={handleCreateListing}
      >
        <ListingsFilters
          filters={filters}
          viewMode={viewMode}
          onUpdateFilter={(key, value) => updateFilter(key, value)}
          onToggleMore={toggleMoreFilter}
          onResetFilters={resetFilters}
          onViewModeChange={setViewMode}
        />
      </ListingsHeader>

      <ListingsTabs
        activeStatus={status}
        statusCounts={statusCounts}
        onStatusChange={setStatus}
      />

      <section
        role="region"
        aria-label="listing guidance"
        className="flex items-start gap-3 rounded-md border border-border bg-muted/40 p-4 text-sm text-muted-foreground"
      >
        <AlertCircle className="mt-1 h-5 w-5 text-sky-500" aria-hidden />
        <p>
          The accuracy of our location data has improved. We encourage you to
          update your listing&apos;s location to boost prominence. Existing
          listings won&apos;t be affected, but updates are highly recommended
          when extending listing expiry.
        </p>
      </section>

      <ListingsTable
        listings={filteredListings}
        viewMode={viewMode}
        onResetFilters={resetFilters}
        createListingHref="/listing/create"
      />
    </main>
  );
}
