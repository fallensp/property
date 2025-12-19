"use client";

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Upload, Star, StarOff, ArrowLeft, ArrowRight, Trash2, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { forwardRef } from 'react';

type PhotoItem = {
  id: string;
  url: string;
  altText?: string;
  tag?: string;
  isCover: boolean;
  uploadStatus?: 'pending' | 'uploading' | 'complete' | 'failed';
};

type MediaUploaderProps = {
  photos: PhotoItem[];
  onUploadClick: () => void;
  onRemove: (id: string) => void;
  onMakeCover: (id: string) => void;
  onMoveLeft: (id: string) => void;
  onMoveRight: (id: string) => void;
  minimumRequired: number;
  error?: string;
  onFilesSelected?: (input: HTMLInputElement) => void;
};

export const MediaUploader = forwardRef<HTMLInputElement, MediaUploaderProps>(
  (
    {
      photos,
      onUploadClick,
      onRemove,
      onMakeCover,
      onMoveLeft,
      onMoveRight,
      minimumRequired,
      error,
      onFilesSelected
    },
    uploadInputRef
  ) => {
    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Photos ({photos.length})</h3>
            <p className="text-sm text-muted-foreground">
              Add at least {minimumRequired} high-quality photos. The first photo becomes the cover.
            </p>
          </div>
          <Button
            type="button"
            variant="default"
            onClick={onUploadClick}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" aria-hidden />
            Upload photos
          </Button>
        </div>
        {error && (
          <p className="text-sm text-destructive" data-testid="photos-error">
            {error}
          </p>
        )}
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
          {photos.map((photo, index) => (
            <figure
              key={photo.id}
              className={cn(
                'group relative overflow-hidden rounded-xl border border-border bg-muted/20 shadow-sm transition hover:border-primary/50',
                photo.isCover && 'ring-2 ring-primary'
              )}
            >
              <img
                src={photo.url}
                alt={photo.altText ?? 'Listing photo'}
                className={cn(
                  "h-48 w-full object-cover",
                  (photo.uploadStatus === 'pending' || photo.uploadStatus === 'uploading') && 'opacity-70'
                )}
              />
              {/* Upload status overlay */}
              {(photo.uploadStatus === 'pending' || photo.uploadStatus === 'uploading') && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="text-xs font-medium text-foreground">
                      {photo.uploadStatus === 'pending' ? 'Queued...' : 'Uploading...'}
                    </span>
                  </div>
                </div>
              )}
              {photo.uploadStatus === 'failed' && (
                <div className="absolute inset-0 flex items-center justify-center bg-destructive/20">
                  <div className="flex flex-col items-center gap-2">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                    <span className="text-xs font-medium text-destructive">Upload failed</span>
                  </div>
                </div>
              )}
              <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-background/90 to-transparent p-3 text-xs text-muted-foreground">
                <span className="rounded-md bg-background/80 px-2 py-1 font-medium text-foreground">
                  {photo.tag ?? 'Photo'}
                </span>
                <div className="flex items-center gap-2">
                  {photo.uploadStatus === 'complete' && (
                    <span className="flex items-center gap-1 rounded-md bg-green-600/90 px-2 py-1 text-[0.65rem] font-semibold text-white">
                      <CheckCircle2 className="h-3 w-3" />
                      Uploaded
                    </span>
                  )}
                  {photo.isCover && (
                    <span className="rounded-md bg-primary px-2 py-1 text-[0.65rem] font-semibold text-primary-foreground">
                      Cover
                    </span>
                  )}
                </div>
              </figcaption>
              <div className="absolute inset-0 flex flex-col justify-between opacity-0 transition group-hover:opacity-100">
                <div className="flex justify-end gap-1 p-3">
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    onClick={() => onMakeCover(photo.id)}
                    title={photo.isCover ? 'Cover photo' : 'Make cover'}
                    className={cn('h-8 w-8', photo.isCover && 'bg-primary text-primary-foreground')}
                  >
                    {photo.isCover ? <Star className="h-4 w-4" /> : <StarOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    onClick={() => onRemove(photo.id)}
                    title="Remove photo"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-between gap-1 p-3">
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    onClick={() => onMoveLeft(photo.id)}
                    title="Move left"
                    disabled={index === 0}
                    className="h-8 w-8"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    onClick={() => onMoveRight(photo.id)}
                    title="Move right"
                    disabled={index === photos.length - 1}
                    className="h-8 w-8"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </figure>
          ))}
          {photos.length === 0 && (
            <div className="flex h-44 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
              No photos yet. Upload photos to get started.
            </div>
          )}
        </div>
        <input
          ref={uploadInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => {
            if (onFilesSelected) {
              onFilesSelected(event.currentTarget);
            }
          }}
        />
      </div>
    );
  }
);

MediaUploader.displayName = 'MediaUploader';
