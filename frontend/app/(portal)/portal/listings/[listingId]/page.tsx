import { ListingDetailClient } from "./listing-detail-client";

interface ListingDetailPageProps {
  params: {
    listingId: string;
  };
}

export default function ListingDetailPage({ params }: ListingDetailPageProps) {
  return <ListingDetailClient listingId={params.listingId} />;
}
