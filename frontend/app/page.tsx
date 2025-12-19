'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, ChevronUp, MapPin, Search, Bed, Bath, Car, Maximize, Ban, BadgeCheck, ShieldCheck } from 'lucide-react';

import { ThemeToggle } from '@/components/theme/theme-toggle';
import { UserPill } from '@/components/navigation/user-pill';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ApiError } from '@/lib/api/client';
import { fetchPublicListings } from '@/lib/api/listings';
import { toListingSummary } from '@/lib/api/transformers';
import type { ListingSummary } from '@/lib/types/listings';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Property Listings', href: '/' },
  { label: 'Neighbourhood', href: '/neighbourhood' }
];

const listingPurposes = [
  { label: 'Sale', value: 'sale' },
  { label: 'Rent', value: 'rent' }
];

const propertyCategories = ['Residential', 'Commercial', 'Industrial'];

const propertyTypes = [
  'Bungalow / Villa',
  'Apartment / Condo / Service Residence',
  'Semi-Detached House',
  'Terrace / Link House',
  'Residential Land'
];

const unitTypes = [
  'Intermediate',
  'Corner Lot',
  'End Lot',
  'Duplex',
  'Triplex',
  'Penthouse',
  'Studio',
  'Soho',
  'Loft',
  'Dual Key',
  'Prefer not to say'
];

const availabilityOptions = [
  { label: 'Immediately available', value: 'immediate' },
  { label: 'Scheduled availability', value: 'scheduled' }
];

const furnishingOptions = ['Fully furnished', 'Partially furnished', 'Unfurnished'];

const locationFilters = [
  { label: 'All Locations', active: true },
  { label: 'Nearby', active: false }
];

interface AccordionSection {
  id: string;
  title: string;
}

const accordionSections: AccordionSection[] = [
  { id: 'listing-purpose', title: 'Listing Purpose' },
  { id: 'categories', title: 'Property Categories' },
  { id: 'types', title: 'Property Types' },
  { id: 'unit-types', title: 'Unit Types' },
  { id: 'availability', title: 'Availability' },
  { id: 'furnishing', title: 'Furnishing' },
  { id: 'pricing', title: 'Pricing' }
];

export default function LandingPage() {
  const [openSection, setOpenSection] = useState<string>('listing-purpose');
  const [featuredListings, setFeaturedListings] = useState<ListingSummary[]>([]);
  const [totalListings, setTotalListings] = useState<number | null>(null);
  const [isLoadingListings, setIsLoadingListings] = useState<boolean>(true);
  const [listingsError, setListingsError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    listingType: 'sale',
    category: '',
    propertyType: '',
    unitType: '',
    availability: '',
    furnishing: '',
    minPrice: '',
    maxPrice: '',
  });

  useEffect(() => {
    let active = true;
    setIsLoadingListings(true);
    setListingsError(null);
    fetchPublicListings({
      per_page: 6,
      status: 'online',
      listing_type: filters.listingType || undefined,
      category: filters.category ? filters.category.toLowerCase() : undefined,
      property_type: filters.propertyType || undefined,
      property_unit_type: filters.unitType || undefined,
      availability: filters.availability || undefined,
      furnishing: filters.furnishing || undefined,
      min_price: filters.minPrice || undefined,
      max_price: filters.maxPrice || undefined,
    })
      .then((response) => {
        if (!active) return;
        setFeaturedListings(response.data.map((listing) => toListingSummary(listing)));
        setTotalListings(response.meta?.total ?? response.data.length);
      })
      .catch((error) => {
        if (!active) return;
        const message =
          error instanceof ApiError
            ? error.message
            : error instanceof Error
              ? error.message
              : 'Unable to load listings right now.';
        setListingsError(message);
      })
      .finally(() => {
        if (active) {
          setIsLoadingListings(false);
        }
      });

    return () => {
      active = false;
    };
  }, [filters]);

  const toggleSection = (sectionId: string) => {
    setOpenSection((prev) => (prev === sectionId ? '' : sectionId));
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === prev[key] ? '' : value,
    }));
  };

  const handlePriceChange = (key: 'minPrice' | 'maxPrice', value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/80">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/branding/property-ai-logo.svg"
              alt="Property AI"
              width={150}
              height={32}
              className="h-6 w-auto"
            />
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'transition hover:text-primary',
                  link.href === '/' && 'text-primary'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle className="hidden sm:inline-flex" />
            <UserPill />
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <section className="flex flex-col gap-6 lg:flex-row">
          <aside className="flex w-full flex-col gap-6 lg:w-72">
            {/* Trust Banner */}
            <div className="rounded-xl bg-primary/10 border border-primary/20 p-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20">
                    <Ban className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">No Duplicate Listing</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20">
                    <BadgeCheck className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Only Licensed Negotiator</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">No Fake Pricing</span>
                </div>
              </div>
            </div>

            {accordionSections.map((section) => (
              <Card key={section.id} className="overflow-hidden border-border/80 bg-card">
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-foreground"
                >
                  <span>
                    {section.title}
                  </span>
                  {openSection === section.id ? (
                    <ChevronUp className="h-4 w-4 text-primary" aria-hidden />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-primary" aria-hidden />
                  )}
                </button>

                {openSection === section.id ? (
                  <CardContent className="space-y-4 border-t border-border/60 bg-muted/20 p-5 text-sm">
                    {section.id === 'listing-purpose' && (
                      <div className="flex gap-2">
                        {listingPurposes.map((purpose) => (
                          <button
                            key={purpose.label}
                            type="button"
                            onClick={() => handleFilterChange('listingType', purpose.value)}
                            className={cn(
                              'flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition',
                              filters.listingType === purpose.value
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-border bg-muted/40 text-muted-foreground hover:bg-muted/60'
                            )}
                          >
                            {purpose.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {section.id === 'categories' && (
                      <div className="space-y-3 text-sm text-muted-foreground">
                        {propertyCategories.map((category) => (
                          <label key={category} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="category"
                              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                              checked={filters.category === category.toLowerCase()}
                              onChange={() => handleFilterChange('category', category.toLowerCase())}
                            />
                            {category}
                          </label>
                        ))}
                      </div>
                    )}

                    {section.id === 'types' && (
                      <div className="space-y-3 text-sm text-muted-foreground">
                        {propertyTypes.map((type) => (
                          <label key={type} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="propertyType"
                              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                              checked={filters.propertyType === type}
                              onChange={() => handleFilterChange('propertyType', type)}
                            />
                            {type}
                          </label>
                        ))}
                      </div>
                    )}

                    {section.id === 'unit-types' && (
                      <div className="space-y-3 text-sm text-muted-foreground">
                        {unitTypes.map((type) => (
                          <label key={type} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="unitType"
                              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                              checked={filters.unitType === type}
                              onChange={() => handleFilterChange('unitType', type)}
                            />
                            {type}
                          </label>
                        ))}
                      </div>
                    )}

                    {section.id === 'availability' && (
                      <div className="space-y-3 text-sm text-muted-foreground">
                        {availabilityOptions.map((option) => (
                          <label key={option.value} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="availability"
                              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                              checked={filters.availability === option.value}
                              onChange={() => handleFilterChange('availability', option.value)}
                            />
                            {option.label}
                          </label>
                        ))}
                      </div>
                    )}

                    {section.id === 'furnishing' && (
                      <div className="space-y-3 text-sm text-muted-foreground">
                        {furnishingOptions.map((option) => (
                          <label key={option} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="furnishing"
                              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                              checked={filters.furnishing === option.toLowerCase()}
                              onChange={() => handleFilterChange('furnishing', option.toLowerCase())}
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    )}

                    {section.id === 'pricing' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase text-muted-foreground">
                            Minimum
                          </label>
                          <input
                            type="number"
                            inputMode="numeric"
                            placeholder="E.g 5000"
                            value={filters.minPrice}
                            onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                            className="mt-2 w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold uppercase text-muted-foreground">
                            Maximum
                          </label>
                          <input
                            type="number"
                            inputMode="numeric"
                            placeholder="E.g 10000"
                            value={filters.maxPrice}
                            onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                            className="mt-2 w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="w-full rounded-full text-sm"
                            onClick={() => setFilters((prev) => ({ ...prev, minPrice: '', maxPrice: '' }))}
                          >
                            Clear
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                ) : null}
              </Card>
            ))}
          </aside>

          <section className="flex-1 space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                    All Properties for Rent
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {totalListings !== null ? `${totalListings} listings curated for you` : 'Loading listings…'}
                  </p>
                </div>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Search className="h-4 w-4" aria-hidden />
                  <span className="sr-only">Search listings</span>
                </Button>
              </div>

            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {isLoadingListings
                ? Array.from({ length: 6 }).map((_, index) => (
                  <Card key={`skeleton-${index}`} className="overflow-hidden border-border/80 bg-muted/30">
                    <div className="h-48 w-full bg-muted animate-pulse" />
                    <CardContent className="space-y-3 p-5">
                      <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                      <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
                      <div className="h-4 w-1/3 rounded bg-muted animate-pulse" />
                      <div className="flex gap-2">
                        <span className="h-6 w-16 rounded-full bg-muted animate-pulse" />
                        <span className="h-6 w-16 rounded-full bg-muted animate-pulse" />
                      </div>
                    </CardContent>
                  </Card>
                ))
                : listingsError ? (
                  <Card className="border-destructive/30 bg-destructive/10 sm:col-span-2 xl:col-span-3">
                    <CardContent className="p-5 text-sm text-destructive">
                      {listingsError}
                    </CardContent>
                  </Card>
                ) : featuredListings.length === 0 ? (
                  <p className="text-sm text-muted-foreground sm:col-span-2 xl:col-span-3">
                    No live listings yet. Check back soon.
                  </p>
                ) : (
                  featuredListings.map((listing) => (
                    <Link key={listing.id} href={`/property/${listing.id}`}>
                      <Card className="overflow-hidden border-border/80 bg-card transition-all hover:border-primary/50 hover:shadow-md">
                        <div className="relative h-48 w-full overflow-hidden">
                          <Image
                            src={listing.thumbnailUrl}
                            alt={listing.title}
                            fill
                            className="object-cover transition-transform duration-300 hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                        </div>
                        <CardContent className="space-y-3 p-5">
                          <div className="space-y-1">
                            <h3 className="text-base font-semibold text-foreground">
                              {listing.title}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {listing.address}
                            </p>
                          </div>
                          <p className="text-lg font-semibold text-primary">{listing.price}</p>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            {listing.attributes.slice(0, 4).map((attr) => {
                              const icon = (() => {
                                switch (attr.icon) {
                                  case "bed":
                                    return <Bed className="h-3 w-3" />;
                                  case "bath":
                                    return <Bath className="h-3 w-3" />;
                                  case "car":
                                    return <Car className="h-3 w-3" />;
                                  case "size":
                                    return <Maximize className="h-3 w-3" />;
                                  default:
                                    return <MapPin className="h-3 w-3" />;
                                }
                              })();
                              return (
                                <Badge
                                  key={`${listing.id}-${attr.label}`}
                                  variant="secondary"
                                  className="flex items-center gap-1 rounded-full px-3 py-1 text-xs"
                                >
                                  {icon}
                                  <span>{attr.label}</span>
                                </Badge>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                )}
            </div>

            <div className="flex items-center justify-between border-t border-border pt-6 text-sm text-muted-foreground">
              <p>
                {isLoadingListings
                  ? 'Loading listings…'
                  : listingsError
                    ? 'Unable to load listings.'
                    : `Showing ${featuredListings.length} of ${totalListings ?? featuredListings.length} listings`}
              </p>
              <Button
                variant="outline"
                className="rounded-full px-6"
                disabled={isLoadingListings || Boolean(listingsError)}
              >
                View more listings
              </Button>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
