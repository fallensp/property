"use client";

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

type ValidationModeToggleProps = {
  strictEnabled: boolean;
  onToggle: (strict: boolean) => void;
};

export function ValidationModeToggle({ strictEnabled, onToggle }: ValidationModeToggleProps) {
  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Label htmlFor="strict-validation-toggle" className="cursor-pointer">
          Strict validation
        </Label>
        <Switch
          id="strict-validation-toggle"
          role="switch"
          aria-label="Strict validation"
          checked={strictEnabled}
          onCheckedChange={onToggle}
          data-testid="validation-toggle"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        {strictEnabled
          ? 'All required fields must pass before proceeding.'
          : 'Validation checks are skipped for fast UI walkthroughs.'}
      </p>
    </div>
  );
}
