import { cn } from '@/lib/utils';

type ValidationBannerProps = {
  message: string;
  variant?: 'neutral' | 'error' | 'success';
};

const variantStyles: Record<Required<ValidationBannerProps>['variant'], string> = {
  neutral: 'border-border bg-muted/50 text-foreground',
  error: 'border-destructive/40 bg-destructive/10 text-destructive',
  success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700'
};

export function ValidationBanner({ message, variant = 'neutral' }: ValidationBannerProps) {
  if (!message) return null;

  const role = variant === 'error' ? 'alert' : undefined;

  return (
    <div
      role={role}
      data-testid="validation-banner"
      className={cn(
        'w-full rounded-lg border px-4 py-3 text-sm font-medium shadow-sm',
        variantStyles[variant]
      )}
    >
      {message}
    </div>
  );
}
