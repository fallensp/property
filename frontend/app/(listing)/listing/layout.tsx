import type { Metadata } from "next";
import { PortalHeader } from "@/components/portal/portal-header";

export const metadata: Metadata = {
  title: "Create Listing",
  description:
    "Guided wizard for crafting property listings with validation and preview.",
};

export default function ListingCreateLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/40">
      <PortalHeader />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(260px,320px)_minmax(0,1fr)]">
          {children}
        </div>
      </div>
    </div>
  );
}
