import Image from "next/image";
import { ListingSummary } from "@/lib/mock-data/listings";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";

interface PropertyGalleryProps {
    listing: ListingSummary;
}

export function PropertyGallery({ listing }: PropertyGalleryProps) {
    return (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted sm:aspect-[2/1] lg:aspect-[2.5/1]">
            <Image
                src={listing.thumbnailUrl}
                alt={listing.title}
                fill
                className="object-cover"
                priority
            />
            <div className="absolute bottom-4 right-4">
                <Button variant="secondary" size="sm" className="gap-2 rounded-full">
                    <ImageIcon className="h-4 w-4" />
                    View All Photos
                </Button>
            </div>
        </div>
    );
}
