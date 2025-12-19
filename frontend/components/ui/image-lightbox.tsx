"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface LightboxImage {
  src: string;
  alt: string;
}

interface ImageLightboxProps {
  images: LightboxImage[];
  initialIndex?: number;
  open: boolean;
  onClose: () => void;
}

export function ImageLightbox({
  images,
  initialIndex = 0,
  open,
  onClose,
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    startIndex: initialIndex,
    loop: true,
  });

  // Sync carousel with current index
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Reset to initial index when opening
  useEffect(() => {
    if (open && emblaApi) {
      emblaApi.scrollTo(initialIndex, true);
      setCurrentIndex(initialIndex);
    }
  }, [open, initialIndex, emblaApi]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        emblaApi?.scrollPrev();
      } else if (e.key === "ArrowRight") {
        emblaApi?.scrollNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, emblaApi]);

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();
  const scrollTo = (index: number) => emblaApi?.scrollTo(index);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95"
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery"
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4">
        <span className="text-sm font-medium text-white/80">
          {currentIndex + 1} / {images.length}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10"
          onClick={onClose}
          aria-label="Close gallery"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      {/* Main carousel */}
      <div className="flex h-full items-center justify-center">
        {/* Previous button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 z-10 h-12 w-12 rounded-full text-white hover:bg-white/10 hidden md:flex"
          onClick={scrollPrev}
          aria-label="Previous image"
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>

        {/* Carousel */}
        <div className="w-full h-full overflow-hidden" ref={emblaRef}>
          <div className="flex h-full">
            {images.map((image, index) => (
              <div
                key={index}
                className="flex-[0_0_100%] min-w-0 flex items-center justify-center p-4 md:p-12"
              >
                <div className="relative w-full h-full max-w-5xl max-h-[80vh]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 80vw"
                    priority={index === currentIndex}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 z-10 h-12 w-12 rounded-full text-white hover:bg-white/10 hidden md:flex"
          onClick={scrollNext}
          aria-label="Next image"
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      </div>

      {/* Thumbnail strip */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
        <div className="flex justify-center gap-2 overflow-x-auto py-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                "relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all",
                index === currentIndex
                  ? "border-white opacity-100"
                  : "border-transparent opacity-50 hover:opacity-75"
              )}
              aria-label={`View image ${index + 1}`}
              aria-current={index === currentIndex ? "true" : undefined}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
