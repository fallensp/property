"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AlertCircle, MapPin, Upload, X } from "lucide-react";

import { PortalHeader } from "@/components/portal/portal-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePortalAuth } from "@/app/(portal)/portal/hooks/use-portal-auth";
import { createNeighbourhood } from "@/lib/api/neighbourhoods";

export default function CreateNeighbourhoodPage() {
  const router = useRouter();
  const user = usePortalAuth((state) => state.user);
  const token = usePortalAuth((state) => state.token);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = user && (user.role === "admin" || user.id === 1);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("You must be signed in.");
      return;
    }
    if (!isAdmin) {
      setError("Only admins can create neighbourhoods.");
      return;
    }
    if (!name.trim()) {
      setError("Neighbourhood name is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createNeighbourhood(token, {
        name: name.trim(),
        image: imageFile ?? undefined,
      });
      router.push("/portal/neighbourhoods");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to create neighbourhood.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-muted/40 text-center">
        <PortalHeader />
        <main className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-16">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" aria-hidden />
            <p className="text-sm font-medium">
              You do not have permission to create neighbourhoods.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <PortalHeader />
      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MapPin className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <CardTitle>Add Neighbourhood</CardTitle>
                <CardDescription>
                  Create a new neighbourhood area for property listings.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              <div className="space-y-2">
                <Label htmlFor="name">Neighbourhood Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Bangsar, Mont Kiara, KLCC"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Image</Label>
                {imagePreview ? (
                  <div className="relative">
                    <div className="relative h-48 w-full overflow-hidden rounded-lg border border-border/60">
                      <Image
                        src={imagePreview}
                        alt="Neighbourhood preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute right-2 top-2 rounded-full bg-background/80 p-2 text-destructive hover:bg-background"
                      aria-label="Remove image"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-48 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border/60 bg-muted/20 text-muted-foreground transition-colors hover:border-primary/50 hover:bg-muted/40"
                  >
                    <Upload className="h-8 w-8" />
                    <span className="text-sm">Click to upload image</span>
                    <span className="text-xs">PNG, JPG up to 5MB</span>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>

              {error ? (
                <p className="text-sm text-destructive">{error}</p>
              ) : null}

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/portal/neighbourhoods")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create neighbourhood"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
