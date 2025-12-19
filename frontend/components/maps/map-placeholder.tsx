import { MapPin } from "lucide-react";

interface MapPlaceholderProps {
  message?: string;
  height?: string;
  className?: string;
}

export function MapPlaceholder({
  message = "Select a location to preview the map",
  height = "320px",
  className,
}: MapPlaceholderProps) {
  return (
    <div
      className={`relative rounded-xl border border-border bg-gradient-to-br from-primary/20 via-muted to-muted/40 flex items-center justify-center ${className ?? ""}`}
      style={{ height }}
    >
      <div className="text-center space-y-2">
        <MapPin className="h-8 w-8 text-muted-foreground mx-auto" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
