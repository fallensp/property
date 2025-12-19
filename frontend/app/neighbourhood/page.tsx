'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Home } from 'lucide-react';

import { ThemeToggle } from '@/components/theme/theme-toggle';
import { UserPill } from '@/components/navigation/user-pill';
import { Card, CardContent } from '@/components/ui/card';
import { listPublicNeighbourhoods, type Neighbourhood } from '@/lib/api/neighbourhoods';

const navLinks = [
  { label: 'Property Listings', href: '/' },
  { label: 'Neighbourhood', href: '/neighbourhood' }
];

export default function NeighbourhoodPage() {
  const [neighbourhoods, setNeighbourhoods] = useState<Neighbourhood[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);

    listPublicNeighbourhoods()
      .then((data) => {
        if (!active) return;
        setNeighbourhoods(data);
      })
      .catch((err) => {
        if (!active) return;
        const message = err instanceof Error ? err.message : 'Unable to load neighbourhoods.';
        setError(message);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

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
                className={`transition hover:text-primary ${
                  link.href === '/neighbourhood' ? 'text-primary' : ''
                }`}
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

      <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Explore Neighbourhoods
          </h1>
          <p className="mt-2 text-muted-foreground">
            Discover properties in your preferred neighbourhood areas.
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={`skeleton-${index}`} className="overflow-hidden border-border/80 bg-muted/30">
                <div className="h-48 w-full animate-pulse bg-muted" />
                <CardContent className="space-y-3 p-5">
                  <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="border-destructive/30 bg-destructive/10">
            <CardContent className="p-5 text-sm text-destructive">
              {error}
            </CardContent>
          </Card>
        ) : neighbourhoods.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <MapPin className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-medium text-foreground">No neighbourhoods yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Neighbourhoods will appear here once they are added.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {neighbourhoods.map((neighbourhood) => (
              <Link
                key={neighbourhood.id}
                href={`/?neighbourhood=${neighbourhood.id}`}
                className="group"
              >
                <Card className="overflow-hidden border-border/80 bg-card transition-all hover:border-primary/50 hover:shadow-md">
                  <div className="relative h-48 w-full overflow-hidden bg-muted">
                    {neighbourhood.image_url ? (
                      <Image
                        src={neighbourhood.image_url}
                        alt={neighbourhood.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-muted">
                        <MapPin className="h-12 w-12 text-muted-foreground/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-lg font-semibold text-white">
                        {neighbourhood.name}
                      </h3>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Home className="h-4 w-4" />
                      <span>
                        {neighbourhood.listings_count ?? 0}{' '}
                        {(neighbourhood.listings_count ?? 0) === 1 ? 'listing' : 'listings'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
