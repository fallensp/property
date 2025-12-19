import type { ListingDetail } from "@/lib/types/listing-details";
import { Bed, Bath, Car, Maximize, CheckCircle2, MapPin, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { GoogleMapPreview } from "@/components/maps/google-map-preview";
import { MapPlaceholder } from "@/components/maps/map-placeholder";

interface PropertyInfoProps {
    listing: ListingDetail;
}

const formatValue = (value?: string | number | null, fallback = "—") =>
    value === undefined || value === null || value === "" ? fallback : String(value);

export function PropertyInfo({ listing }: PropertyInfoProps) {
    const summary = listing.summary;
    const quickFacts = [
        { label: "Listing purpose", value: listing.listingPurpose === "sale" ? "For Sale" : "For Rent" },
        { label: "Category", value: listing.propertyCategory },
        {
            label: "Availability",
            value:
                listing.availabilityMode === "immediate"
                    ? "Immediately available"
                    : listing.availableDate ?? "Scheduled",
        },
        { label: "Tenure", value: listing.location.tenure || "Not specified" },
        { label: "Completion year", value: listing.location.completionYear || "Not specified" },
        { label: "Property type", value: listing.location.propertyType },
        { label: "Sub type", value: listing.location.propertySubType },
        { label: "Unit type", value: listing.location.propertyUnitType },
    ];

    const unitFacts = [
        { label: "Built-up", value: listing.unit.builtUp || "Not specified", icon: Maximize },
        { label: "Land area", value: listing.unit.landArea || "Not specified", icon: Maximize },
        { label: "Bedrooms", value: listing.unit.bedrooms ?? "—", icon: Bed },
        { label: "Bathrooms", value: listing.unit.bathrooms ?? "—", icon: Bath },
        { label: "Maid rooms", value: listing.unit.maidRooms ?? 0, icon: Bed },
        { label: "Parking", value: listing.unit.parking ?? "—", icon: Car },
        { label: "Furnishing", value: listing.unit.furnishing || "Not specified", icon: CheckCircle2 },
    ];

    const pricingFacts = [
        { label: "Price type", value: listing.pricing.priceType },
        { label: "Selling / rental", value: listing.pricing.sellingPrice },
        { label: "Maintenance fee", value: listing.pricing.maintenanceFee },
        { label: "Price per sqft", value: listing.pricing.pricePerSqft || "—" },
    ];

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h2 className="text-xl font-semibold">Overview</h2>
                <p className="text-sm text-muted-foreground">
                    {formatValue(listing.headline, "Add a compelling headline to attract buyers")}
                </p>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                    <p>
                        {formatValue(
                            listing.description,
                            "No description added yet. Include unique selling points to help buyers choose your listing.",
                        )}
                    </p>
                </div>
            </div>

            <Card className="border-border/70">
                <CardContent className="space-y-4 p-5">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Tag className="h-4 w-4 text-primary" />
                        Quick facts
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {quickFacts.map((item) => (
                            <div key={item.label} className="rounded-lg border border-border/60 bg-muted/20 p-3">
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                    {item.label}
                                </p>
                                <p className="mt-1 text-sm font-semibold text-foreground">{formatValue(item.value)}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="border-border/70">
                <CardContent className="space-y-4 p-5">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Maximize className="h-4 w-4 text-primary" />
                        Unit details
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        {unitFacts.map((fact) => {
                            const Icon = fact.icon ?? CheckCircle2;
                            return (
                                <div
                                    key={fact.label}
                                    className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/20 p-3"
                                >
                                    <Icon className="h-4 w-4 text-primary" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">{fact.label}</p>
                                        <p className="text-sm font-semibold text-foreground">{formatValue(fact.value)}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {listing.unit.features?.length ? (
                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-foreground">Features</p>
                            <div className="flex flex-wrap gap-2">
                                {listing.unit.features.map((feature) => (
                                    <span
                                        key={feature}
                                        className="rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-xs text-foreground"
                                    >
                                        {feature}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </CardContent>
            </Card>

            <Card className="border-border/70">
                <CardContent className="space-y-4 p-5">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Tag className="h-4 w-4 text-primary" />
                        Pricing & fees
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {pricingFacts.map((fact) => (
                            <div key={fact.label} className="rounded-lg border border-border/60 bg-muted/20 p-3">
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                    {fact.label}
                                </p>
                                <p className="mt-1 text-sm font-semibold text-foreground">{formatValue(fact.value)}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="border-border/70">
                <CardContent className="space-y-4 p-5">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <MapPin className="h-4 w-4 text-primary" />
                        Location
                    </div>
                    <p className="text-sm font-semibold text-foreground">{listing.location.developmentName}</p>
                    <p className="text-sm text-muted-foreground">
                        {listing.location.address || "Address not provided"}
                    </p>
                    <div className="pt-2">
                        {listing.location.latitude && listing.location.longitude ? (
                            <GoogleMapPreview
                                latitude={listing.location.latitude}
                                longitude={listing.location.longitude}
                                title={listing.location.developmentName}
                                height="240px"
                            />
                        ) : (
                            <MapPlaceholder
                                message="Map location not available"
                                height="200px"
                            />
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
