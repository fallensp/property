import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Listing',
  description:
    'Guided wizard for crafting property listings with validation and preview.'
};

export default function ListingCreateLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/40">
      <div className="container grid min-h-screen gap-8 py-10 lg:grid-cols-[300px_1fr]">
        {children}
      </div>
    </div>
  );
}
