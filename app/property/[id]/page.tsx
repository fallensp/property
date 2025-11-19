import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft } from 'lucide-react';

import { listings } from '@/lib/mock-data/listings';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { PropertyHeader } from '@/components/property/property-header';
import { PropertyGallery } from '@/components/property/property-gallery';
import { PropertyInfo } from '@/components/property/property-info';
import { AgentCard } from '@/components/property/agent-card';

interface PropertyDetailPageProps {
    params: {
        id: string;
    };
}

export async function generateStaticParams() {
    return listings.map((listing) => ({
        id: listing.id,
    }));
}

export default function PropertyDetailPage({ params }: PropertyDetailPageProps) {
    const listing = listings.find((l) => l.id === params.id);

    if (!listing) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <header className="border-b border-border bg-background/80 sticky top-0 z-50 backdrop-blur-md">
                <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Button variant="ghost" size="sm" asChild className="-ml-2 gap-1 text-muted-foreground hover:text-foreground">
                        <Link href="/">
                            <ChevronLeft className="h-4 w-4" />
                            Back to Listings
                        </Link>
                    </Button>

                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <Button asChild className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90">
                            <Link href="/login">Login</Link>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-8">
                        <PropertyHeader listing={listing} />
                        <PropertyGallery listing={listing} />
                        <PropertyInfo listing={listing} />
                    </div>

                    <aside className="lg:col-span-1">
                        <AgentCard />
                    </aside>
                </div>
            </main>
        </div>
    );
}
