"use client";

import { useEffect, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MediaUploader } from '@/app/(listing)/listing/create/components/media-uploader';
import {
  useListingStore,
  type MediaAsset
} from '@/app/(listing)/listing/create/state/listing-store';
import { PROJECT_PHOTO_LIBRARY } from '@/lib/mock-data/gallery';

import { Image as ImageIcon } from 'lucide-react';

type GalleryStepProps = {
  errors: Record<string, string>;
};

export function GalleryStep({ errors }: GalleryStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadedUrlsRef = useRef<Set<string>>(new Set());
  const {
    media,
    addPhotos,
    addSamplePhotos,
    removePhoto,
    movePhoto,
    setCoverPhoto,
    toggleProjectPhoto,
    selectAllProjectPhotos
  } = useListingStore((state) => ({
    media: state.draft.media,
    addPhotos: state.addPhotos,
    addSamplePhotos: state.addSamplePhotos,
    removePhoto: state.removePhoto,
    movePhoto: state.movePhoto,
    setCoverPhoto: state.setCoverPhoto,
    toggleProjectPhoto: state.toggleProjectPhoto,
    selectAllProjectPhotos: state.selectAllProjectPhotos
  }));

  const orderedPhotos = useMemo(
    () => media.photos.slice().sort((a, b) => a.order - b.order),
    [media.photos]
  );

  const coverId = media.coverPhotoId ?? orderedPhotos[0]?.id ?? null;

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFilesSelected = (input: HTMLInputElement | null) => {
    if (!input?.files || input.files.length === 0) return;
    const files = Array.from(input.files);
    const assets: MediaAsset[] = files.map((file, index) => ({
      id: crypto.randomUUID(),
      type: 'photo',
      fileName: file.name,
      url: (() => {
        const url = URL.createObjectURL(file);
        uploadedUrlsRef.current.add(url);
        return url;
      })(),
      altText: file.name,
      order: media.photos.length + index,
      source: 'upload'
    }));
    addPhotos(assets);
    input.value = '';
  };

  const selectedProjectIds = useMemo(
    () => new Set(media.projectPhotos.map((photo) => photo.referenceId).filter(Boolean)),
    [media.projectPhotos]
  );

  useEffect(() => {
    const uploadedUrls = uploadedUrlsRef.current;
    return () => {
      uploadedUrls.forEach((url) => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
      uploadedUrls.clear();
    };
  }, []);

  return (
    <div className="space-y-8">
      <MediaUploader
        ref={fileInputRef}
        photos={orderedPhotos.map((photo) => ({
          id: photo.id,
          url: photo.url,
          altText: photo.altText,
          tag: photo.tag,
          isCover: coverId === photo.id
        }))}
        onUploadClick={handleUploadClick}
        onAddSampleClick={() => addSamplePhotos(5)}
        onRemove={(id) => {
          const asset = orderedPhotos.find((photo) => photo.id === id);
          if (asset?.source === 'upload' && asset.url.startsWith('blob:')) {
            URL.revokeObjectURL(asset.url);
            uploadedUrlsRef.current.delete(asset.url);
          }
          removePhoto(id);
        }}
        onMakeCover={setCoverPhoto}
        onMoveLeft={(id) => movePhoto(id, 'left')}
        onMoveRight={(id) => movePhoto(id, 'right')}
        minimumRequired={5}
        error={errors.photos}
        onFilesSelected={(input) => handleFilesSelected(input)}
      />
      {errors.coverPhotoId && (
        <p className="text-sm text-destructive" data-testid="cover-photo-error">
          {errors.coverPhotoId}
        </p>
      )}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Videos ({media.videos.length})</h3>
          <Button type="button" variant="secondary" size="icon" disabled>
            <ImageIcon className="h-4 w-4" aria-hidden />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Video support is coming soon. Upload via desktop to embed walkthroughs.
        </p>
      </section>
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Floorplans ({media.floorplans.length})</h3>
          <Button type="button" variant="secondary" size="icon" disabled>
            <ImageIcon className="h-4 w-4" aria-hidden />
          </Button>
        </div>
      </section>
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Virtual Tours ({media.virtualTours.length})</h3>
          <Button type="button" variant="secondary" size="icon" disabled>
            <ImageIcon className="h-4 w-4" aria-hidden />
          </Button>
        </div>
      </section>
      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Project photos ({media.projectPhotos.length})</h3>
            <p className="text-sm text-muted-foreground">
              Highlight developer-approved imagery. These do not count towards the 5 photo minimum.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => selectAllProjectPhotos(false)}
            >
              Clear
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={() => selectAllProjectPhotos(true)}
            >
              Select all
            </Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {PROJECT_PHOTO_LIBRARY.map((sample) => {
            const selected = selectedProjectIds.has(sample.id);
            return (
              <article
                key={sample.id}
                className={cn(
                  'overflow-hidden rounded-xl border border-border bg-muted/20 shadow-sm',
                  selected && 'border-primary'
                )}
              >
                <img
                  src={sample.url}
                  alt={sample.label}
                  className="h-40 w-full object-cover"
                />
                <div className="flex items-center justify-between border-t border-border/80 bg-background px-3 py-2 text-xs text-muted-foreground">
                  <span>{sample.label}</span>
                  <Button
                    type="button"
                    size="sm"
                    variant={selected ? 'secondary' : 'default'}
                    onClick={() => toggleProjectPhoto(sample.id, !selected)}
                    data-testid={`project-photo-${sample.id}`}
                  >
                    {selected ? 'Remove' : 'Select'}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
