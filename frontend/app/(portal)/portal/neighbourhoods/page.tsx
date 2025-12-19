"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertCircle, MapPin, Trash2 } from "lucide-react";

import { PortalHeader } from "@/components/portal/portal-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePortalAuth } from "@/app/(portal)/portal/hooks/use-portal-auth";
import {
  listNeighbourhoods,
  deleteNeighbourhood,
  type Neighbourhood,
} from "@/lib/api/neighbourhoods";

export default function NeighbourhoodsListPage() {
  const user = usePortalAuth((state) => state.user);
  const token = usePortalAuth((state) => state.token);
  const [neighbourhoods, setNeighbourhoods] = useState<Neighbourhood[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const isAdmin = user && (user.role === "admin" || user.id === 1);

  const loadNeighbourhoods = async () => {
    if (!token || !isAdmin) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await listNeighbourhoods(token);
      setNeighbourhoods(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to load neighbourhoods.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    if (!token || !isAdmin) return;

    loadNeighbourhoods();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, token]);

  const handleDelete = async (id: number) => {
    if (!token) return;
    if (!confirm("Are you sure you want to delete this neighbourhood?")) return;

    setDeletingId(id);
    try {
      await deleteNeighbourhood(token, String(id));
      setNeighbourhoods((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to delete neighbourhood.";
      alert(message);
    } finally {
      setDeletingId(null);
    }
  };

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-muted/40 text-center">
        <PortalHeader />
        <main className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 py-16">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" aria-hidden />
            <p className="text-sm font-medium">
              You do not have permission to manage neighbourhoods.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <PortalHeader />
      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Neighbourhoods
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage neighbourhood areas for listings.
            </p>
          </div>
          <Button asChild>
            <Link href="/portal/neighbourhoods/create">Add neighbourhood</Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5 text-primary" aria-hidden />
              All Neighbourhoods
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">
                Loading neighbourhoods...
              </p>
            ) : error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : neighbourhoods.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No neighbourhoods found. Create one to get started.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {neighbourhoods.map((neighbourhood) => (
                  <div
                    key={neighbourhood.id}
                    className="group relative overflow-hidden rounded-lg border border-border/60 bg-card"
                  >
                    <div className="relative h-32 w-full bg-muted">
                      {neighbourhood.image_url ? (
                        <Image
                          src={neighbourhood.image_url}
                          alt={neighbourhood.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <MapPin className="h-8 w-8 text-muted-foreground/40" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-foreground">
                        {neighbourhood.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {neighbourhood.listings_count ?? 0} listings
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(neighbourhood.id)}
                      disabled={deletingId === neighbourhood.id}
                      className="absolute right-2 top-2 rounded-full bg-background/80 p-2 text-destructive opacity-0 transition-opacity hover:bg-background group-hover:opacity-100 disabled:opacity-50"
                      aria-label={`Delete ${neighbourhood.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
