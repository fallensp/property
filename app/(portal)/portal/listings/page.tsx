"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import { ListingsHeader } from "./components/listings-header";
import { ListingsFilters } from "./components/listings-filters";
import { ListingsTabs } from "./components/listings-tabs";
import { ListingsTable } from "./components/listings-table";
import { useListingsFilter } from "./hooks/use-listings-filter";
import { usePortalAuth } from "../hooks/use-portal-auth";
import { PortalHeader } from "@/components/portal/portal-header";

export default function PortalListingsPage() {
  const router = useRouter();
  const user = usePortalAuth((state) => state.user);
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
    if (!user) {
      router.replace("/portal");
    }
  }, [router, user]);

  useEffect(() => {
    if (!user) {
      return;
    }
    router.prefetch("/listing/create");
  }, [router, user]);

  const handleCreateListing = () => {
    router.push("/listing/create");
  };

  const shouldRenderContent = Boolean(user);

  return (
    <div className="min-h-screen bg-muted/40">
      <PortalHeader />
      {!shouldRenderContent ? (
        <main className="flex min-h-[60vh] items-center justify-center px-6 py-10">
          <p className="text-sm text-muted-foreground">
            Redirecting to login…
          </p>
        </main>
      ) : (
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-12 pt-6 sm:px-6 lg:px-8">
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
      )}
    </div>
  );
}
