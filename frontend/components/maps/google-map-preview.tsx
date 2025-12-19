"use client";

import { useCallback, memo } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

interface GoogleMapPreviewProps {
  latitude: number;
  longitude: number;
  title?: string;
  height?: string;
  zoom?: number;
  className?: string;
}

const defaultMapContainerStyle = {
  width: "100%",
  borderRadius: "0.75rem",
};

const defaultMapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
};

export const GoogleMapPreview = memo(function GoogleMapPreview({
  latitude,
  longitude,
  title,
  height = "320px",
  zoom = 15,
  className,
}: GoogleMapPreviewProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
  });

  const center = { lat: latitude, lng: longitude };

  const onLoad = useCallback(() => {
    // Optional: Add any initialization logic
  }, []);

  if (loadError) {
    return (
      <div
        className={`flex items-center justify-center bg-muted/40 rounded-xl border border-border ${className ?? ""}`}
        style={{ height }}
      >
        <p className="text-sm text-muted-foreground">Unable to load map</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        className={`flex items-center justify-center bg-muted/40 rounded-xl border border-border animate-pulse ${className ?? ""}`}
        style={{ height }}
      >
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={{ ...defaultMapContainerStyle, height }}
      mapContainerClassName={className}
      center={center}
      zoom={zoom}
      onLoad={onLoad}
      options={defaultMapOptions}
    >
      <Marker position={center} title={title} />
    </GoogleMap>
  );
});
