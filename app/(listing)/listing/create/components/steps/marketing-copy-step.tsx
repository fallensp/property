"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useListingStore } from "@/app/(listing)/listing/create/state/listing-store";

type StepProps = {
    errors: Record<string, string>;
};

export function MarketingCopyStep({ errors }: StepProps) {
    const draft = useListingStore((state) => state.draft);
    const updateNarrative = useListingStore((state) => state.updateNarrative);

    return (
        <div className="space-y-8">
            <section className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="headline">Headline</Label>
                    <Input
                        id="headline"
                        value={draft.headline}
                        onChange={(event) =>
                            updateNarrative({
                                headline: event.target.value,
                                description: draft.description,
                            })
                        }
                        placeholder="e.g. Stunning Bungalow with Private Pool"
                        maxLength={100}
                    />
                    <p className="text-xs text-muted-foreground">
                        A catchy title for your listing. Max 100 characters.
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        value={draft.description}
                        onChange={(event) =>
                            updateNarrative({
                                headline: draft.headline,
                                description: event.target.value,
                            })
                        }
                        placeholder="Describe the property features, location benefits, and other selling points..."
                        className="min-h-[200px]"
                    />
                    {errors.description && (
                        <p className="text-sm text-destructive">{errors.description}</p>
                    )}
                </div>
            </section>
        </div>
    );
}
