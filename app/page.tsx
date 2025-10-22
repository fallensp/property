'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-8 text-center">
      <section className="max-w-2xl space-y-6 rounded-xl border bg-background p-10 shadow-md">
        <h1 className="text-3xl font-semibold tracking-tight">
          Property Listing Creation
        </h1>
        <p className="text-muted-foreground">
          Launch the guided wizard to create a new property listing. Follow the
          steps to provide listing details, pricing, media, and preview the final
          result before publishing.
        </p>
        <Link
          href="/listing/create"
          className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          Open Listing Wizard
        </Link>
      </section>
    </main>
  );
}
