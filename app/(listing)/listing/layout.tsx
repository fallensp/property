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
      <div className="container grid min-h-screen gap-8 px-4 py-10 lg:grid-cols-[minmax(260px,320px)_minmax(0,1fr)] xl:max-w-[1400px]">
        {children}
      </div>
    </div>
  );
}
