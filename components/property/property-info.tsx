import { ListingSummary } from "@/lib/mock-data/listings";
import { Bed, Bath, Car, Maximize, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface PropertyInfoProps {
    listing: ListingSummary;
}

export function PropertyInfo({ listing }: PropertyInfoProps) {
    const getIcon = (iconName: string) => {
        switch (iconName) {
            case "bed":
                return Bed;
            case "bath":
                return Bath;
            case "car":
                return Car;
            case "size":
                return Maximize;
            default:
                return CheckCircle2;
        }
    };

    return (
        <div className="space-y-8">
            {/* Key Attributes */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {listing.attributes.map((attr, index) => {
                    const Icon = getIcon(attr.icon);
                    return (
                        <Card key={index} className="border-border/50 bg-muted/20">
                            <CardContent className="flex flex-col items-center justify-center gap-2 p-4 text-center">
                                <Icon className="h-6 w-6 text-primary" />
                                <span className="font-semibold">{attr.label}</span>
                                <span className="text-xs text-muted-foreground capitalize">
                                    {attr.icon === "size" ? "Built-up" : attr.icon}
                                </span>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Description */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Description</h2>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                    <p>
                        Experience luxury living in this stunning {listing.propertyType} located in the heart of {listing.address.split(',').slice(-2).join(', ')}.
                        This {listing.listingType} property offers exceptional value with its premium finishes and thoughtful layout.
                    </p>
                    <p>
                        Key features include:
                    </p>
                    <ul className="list-disc pl-4">
                        <li>Spacious living areas perfect for entertaining</li>
                        <li>Modern kitchen with high-end appliances</li>
                        <li>Master suite with walk-in wardrobe</li>
                        <li>Secure parking for {listing.attributes.find(a => a.icon === 'car')?.label || 'multiple'} vehicles</li>
                        {listing.hasFloorplan && <li>Floor plan available upon request</li>}
                        {listing.hasVirtualTour && <li>Virtual tour available</li>}
                    </ul>
                </div>
            </div>

            {/* Property Details */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Property Details</h2>
                <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                    <div className="flex justify-between border-b border-border/50 py-2">
                        <span className="text-muted-foreground">Property Type</span>
                        <span className="font-medium">{listing.propertyType}</span>
                    </div>
                    <div className="flex justify-between border-b border-border/50 py-2">
                        <span className="text-muted-foreground">Unit Type</span>
                        <span className="font-medium">{listing.unitType || "N/A"}</span>
                    </div>
                    <div className="flex justify-between border-b border-border/50 py-2">
                        <span className="text-muted-foreground">Tenure</span>
                        <span className="font-medium">Freehold</span>
                    </div>
                    <div className="flex justify-between border-b border-border/50 py-2">
                        <span className="text-muted-foreground">Furnishing</span>
                        <span className="font-medium">Partially Furnished</span>
                    </div>
                    <div className="flex justify-between border-b border-border/50 py-2">
                        <span className="text-muted-foreground">Posted Date</span>
                        <span className="font-medium">{listing.postedOn}</span>
                    </div>
                    <div className="flex justify-between border-b border-border/50 py-2">
                        <span className="text-muted-foreground">Listing ID</span>
                        <span className="font-medium">{listing.id}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
