import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

type StepCardProps = {
  title: string;
  description: string;
  children: ReactNode;
  onNext?: () => void | boolean | Promise<void | boolean>;
  onPrevious?: () => void;
  nextLabel?: string;
  isNextDisabled?: boolean;
  className?: string;
  statusMessage?: ReactNode;
  auxiliaryActions?: ReactNode;
  isFirstStep?: boolean;
  isLastStep?: boolean;
};

export function StepCard({
  title,
  description,
  children,
  onNext,
  onPrevious,
  nextLabel,
  isNextDisabled = false,
  className,
  statusMessage,
  auxiliaryActions,
  isFirstStep,
  isLastStep
}: StepCardProps) {
  const handleNextClick = () => {
    if (!onNext) {
      return;
    }
    try {
      const result = onNext();
      if (
        result &&
        typeof (result as Promise<unknown>).then === "function" &&
        typeof (result as Promise<unknown>).catch === "function"
      ) {
        (result as Promise<unknown>).catch(() => {});
      }
    } catch {
      // Errors are handled by the caller; avoid crashing the component.
    }
  };

  const nextDisabled = isNextDisabled || !onNext;
  const fallbackLabel = isLastStep ? 'Finish' : 'Next';
  const buttonLabel = nextLabel ?? fallbackLabel;

  return (
    <Card className={cn('flex h-full flex-col', className)}>
      <CardHeader className="pb-6">
        <CardTitle className="text-3xl font-semibold tracking-tight text-foreground">
          {title}
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-6">{children}</CardContent>
      <CardFooter className="flex flex-col gap-3 border-t border-border/60 bg-muted/30 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          {!isFirstStep && (
            <Button
              variant="ghost"
              onClick={onPrevious}
              data-testid="wizard-back"
            >
              Back
            </Button>
          )}
          <Button
            onClick={handleNextClick}
            disabled={nextDisabled}
            data-testid="wizard-next"
          >
            {buttonLabel}
          </Button>
        </div>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:items-end">
          {statusMessage}
          {auxiliaryActions}
        </div>
      </CardFooter>
    </Card>
  );
}
