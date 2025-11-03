import { ListingDetailClient } from "./listing-detail-client";
import { findListingDetail, listingDetails } from "@/lib/mock-data/listing-details";

interface ListingDetailPageProps {
  params: {
    listingId: string;
  };
}

export function generateStaticParams() {
  return listingDetails.map((detail) => ({
    listingId: detail.id,
  }));
}

export default function ListingDetailPage({ params }: ListingDetailPageProps) {
  const detail = findListingDetail(params.listingId);

  return <ListingDetailClient detail={detail} listingId={params.listingId} />;
}
