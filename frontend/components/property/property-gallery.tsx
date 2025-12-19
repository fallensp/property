"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ImageLightbox } from "@/components/ui/image-lightbox";
import type { ListingDetail } from "@/lib/types/listing-details";
import { cn } from "@/lib/utils";

interface PropertyGalleryProps {
  listing: ListingDetail;
  maxPreviewThumbnails?: number;
}

export function PropertyGallery({
  listing,
  maxPreviewThumbnails = 3,
}: PropertyGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const images = listing.gallery;
  const coverImage = images[0] ?? {
    src: listing.summary.thumbnailUrl,
    alt: listing.summary.title,
  };

  // Get thumbnails (skip cover, take up to maxPreviewThumbnails)
  const thumbnails = images.slice(1, maxPreviewThumbnails + 1);
  const remainingCount = Math.max(0, images.length - maxPreviewThumbnails - 1);
  const totalCount = images.length;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  return (
    <>
      <div className="space-y-2">
        {/* Hero image */}
        <div
          className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted cursor-pointer sm:aspect-[2/1] lg:aspect-[2.5/1]"
          onClick={() => openLightbox(0)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && openLightbox(0)}
          aria-label="View cover image in gallery"
        >
          <Image
            src={coverImage.src}
            alt={coverImage.alt}
            fill
            className="object-cover transition-transform hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
        </div>

        {/* Thumbnail grid */}
        {thumbnails.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {thumbnails.map((image, index) => {
              const isLast = index === thumbnails.length - 1;
              const showOverlay = isLast && remainingCount > 0;
              const imageIndex = index + 1; // +1 because cover is index 0

              return (
                <div
                  key={index}
                  className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted cursor-pointer"
                  onClick={() => openLightbox(imageIndex)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && openLightbox(imageIndex)}
                  aria-label={showOverlay ? `View all ${totalCount} photos` : `View photo ${imageIndex + 1}`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                    sizes="(max-width: 768px) 33vw, 20vw"
                  />
                  {showOverlay ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white font-semibold text-lg hover:bg-black/70 transition-colors">
                      +{remainingCount} more
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* View all photos button */}
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => openLightbox(0)}
          >
            <ImageIcon className="h-4 w-4" />
            View All {totalCount} Photos
          </Button>
        </div>
      </div>

      {/* Lightbox */}
      <ImageLightbox
        images={images}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onClose={closeLightbox}
      />
    </>
  );
}
