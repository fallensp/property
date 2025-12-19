"use client";

import { useEffect, useMemo, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MediaUploader } from '@/app/(listing)/listing/create/components/media-uploader';
import {
  useListingStore,
  type MediaAsset
} from '@/app/(listing)/listing/create/state/listing-store';
import { usePortalAuth } from '@/app/(portal)/portal/hooks/use-portal-auth';
import { uploadListingImages, deleteListingImage } from '@/lib/api/listing-images';

import { Image as ImageIcon, Loader2 } from 'lucide-react';

type GalleryStepProps = {
  errors: Record<string, string>;
};

export function GalleryStep({ errors }: GalleryStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadedUrlsRef = useRef<Set<string>>(new Set());
  const pendingFilesRef = useRef<Map<string, File>>(new Map());

  const { token } = usePortalAuth();
  const {
    draft,
    media,
    isUpdateMode,
    addPhotos,
    removePhoto,
    movePhoto,
    setCoverPhoto,
    updatePhotoUploadStatus,
    updatePhotoS3Data,
  } = useListingStore((state) => ({
    draft: state.draft,
    media: state.draft.media,
    isUpdateMode: state.isUpdateMode,
    addPhotos: state.addPhotos,
    removePhoto: state.removePhoto,
    movePhoto: state.movePhoto,
    setCoverPhoto: state.setCoverPhoto,
    updatePhotoUploadStatus: state.updatePhotoUploadStatus,
    updatePhotoS3Data: state.updatePhotoS3Data,
  }));

  const orderedPhotos = useMemo(
    () => media.photos.slice().sort((a, b) => a.order - b.order),
    [media.photos]
  );

  const coverId = media.coverPhotoId ?? orderedPhotos[0]?.id ?? null;

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const uploadToServer = useCallback(async (assetIds: string[], files: File[]) => {
    if (!token) {
      console.warn('No auth token available, skipping server upload');
      return;
    }

    // Mark all as uploading
    assetIds.forEach(id => updatePhotoUploadStatus(id, 'uploading'));

    try {
      // Only pass listing_id if we're editing an existing listing (not creating new)
      // During creation, draft.id is a frontend UUID, not a real backend ULID
      const listingId = isUpdateMode ? draft.id : undefined;
      const results = await uploadListingImages(token, files, listingId);

      // Update each asset with the S3 data
      results.forEach((result, index) => {
        const assetId = assetIds[index];
        if (assetId) {
          updatePhotoS3Data(assetId, {
            s3Url: result.url,
            s3Id: result.id,
            thumbnailUrl: result.thumbnail_url ?? undefined,
          });
          // Clean up the pending file reference
          pendingFilesRef.current.delete(assetId);
        }
      });
    } catch (error) {
      console.error('Failed to upload images:', error);
      // Mark all as failed
      assetIds.forEach(id => updatePhotoUploadStatus(id, 'failed'));
    }
  }, [token, draft.id, isUpdateMode, updatePhotoUploadStatus, updatePhotoS3Data]);

  const handleFilesSelected = (input: HTMLInputElement | null) => {
    if (!input?.files || input.files.length === 0) return;
    const files = Array.from(input.files);

    // Create assets with blob URLs for immediate preview
    const assets: MediaAsset[] = files.map((file, index) => {
      const id = crypto.randomUUID();
      const url = URL.createObjectURL(file);
      uploadedUrlsRef.current.add(url);
      // Store file reference for upload
      pendingFilesRef.current.set(id, file);

      return {
        id,
        type: 'photo',
        fileName: file.name,
        url,
        altText: file.name,
        order: media.photos.length + index,
        source: 'upload',
        uploadStatus: 'pending',
      };
    });

    addPhotos(assets);
    input.value = '';

    // Trigger server upload in background
    const assetIds = assets.map(a => a.id);
    uploadToServer(assetIds, files);
  };


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
          url: photo.s3Url ?? photo.url, // Prefer S3 URL if available
          altText: photo.altText,
          tag: photo.tag,
          isCover: coverId === photo.id,
          uploadStatus: photo.uploadStatus,
        }))}
        onUploadClick={handleUploadClick}
        onRemove={async (id) => {
          const asset = orderedPhotos.find((photo) => photo.id === id);

          // Delete from server if uploaded
          if (asset?.s3Id && token) {
            try {
              await deleteListingImage(token, asset.s3Id);
            } catch (error) {
              console.error('Failed to delete image from server:', error);
            }
          }

          // Clean up blob URL
          if (asset?.source === 'upload' && asset.url.startsWith('blob:')) {
            URL.revokeObjectURL(asset.url);
            uploadedUrlsRef.current.delete(asset.url);
          }

          // Clean up pending file reference
          pendingFilesRef.current.delete(id);

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
    </div>
  );
}
