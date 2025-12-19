import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ListingDetail } from "@/lib/types/listing-details";
import { Heart, Share2, MapPin } from "lucide-react";

interface PropertyHeaderProps {
  listing: ListingDetail;
}

export function PropertyHeader({ listing }: PropertyHeaderProps) {
  const summary = listing.summary;

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          {summary.badges.map((badge) => (
            <Badge
              key={badge.label}
              variant={badge.variant === "premium" ? "default" : "secondary"}
              className="rounded-full"
            >
              {badge.label}
            </Badge>
          ))}
          <Badge variant="outline" className="rounded-full">
            {summary.propertyType}
          </Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {summary.title}
        </h1>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <p>{summary.address}</p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-4">
        <div className="text-right">
          <p className="text-3xl font-bold text-primary">{summary.price}</p>
          <p className="text-sm text-muted-foreground">
            {summary.priceValue && summary.attributes.find(a => a.icon === 'size')
              ? `RM ${(summary.priceValue / parseInt(summary.attributes.find(a => a.icon === 'size')?.label.replace(/[^0-9]/g, '') || '1')).toFixed(0)} psf`
              : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="rounded-full">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
