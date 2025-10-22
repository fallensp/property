"use client";

import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { CheckCircle2, Circle, CircleDashed, OctagonAlert } from "lucide-react";
import {
  useListingStore,
  type WizardStep,
  type StepStatus
} from "@/app/(listing)/listing/create/state/listing-store";
import { STEP_METADATA } from "./step-metadata";

const statusIcon = (status: StepStatus, hasErrors: boolean) => {
  if (status === "blocked" && hasErrors) {
    return <OctagonAlert className="h-5 w-5 text-destructive" aria-hidden />;
  }
  switch (status) {
    case "complete":
      return <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden />;
    case "blocked":
      return <Circle className="h-5 w-5 text-destructive" aria-hidden />;
    case "in-progress":
      return <CircleDashed className="h-5 w-5 text-primary" aria-hidden />;
    default:
      return <Circle className="h-5 w-5 text-muted-foreground" aria-hidden />;
  }
};

const canNavigateToStep = (status: StepStatus, hasErrors: boolean) => {
  if (status === "complete" || status === "in-progress") return true;
  if (status === "blocked" && hasErrors) return true;
  return false;
};

export function ProgressSidebar() {
  const { currentStep, stepOrder, statusByStep, errorsByStep, goToStep } = useListingStore(
    (state) => ({
      currentStep: state.currentStep,
      stepOrder: state.stepOrder,
      statusByStep: state.statusByStep,
      errorsByStep: state.errorsByStep,
      goToStep: state.goToStep
    })
  );

  const completedCount = useMemo(
    () =>
      stepOrder.filter((step) => statusByStep[step] === "complete").length,
    [stepOrder, statusByStep]
  );

  return (
    <aside className="hidden flex-col gap-6 rounded-xl border border-border bg-background p-6 shadow-sm lg:flex">
      <header className="space-y-1">
        <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Progress
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          {completedCount}/{stepOrder.length} steps complete
        </h2>
        <p className="text-sm text-muted-foreground">
          Follow the sequence to provide a complete, high-quality listing.
        </p>
      </header>
      <ol className="space-y-3">
        {stepOrder.map((step) => {
          const metadata = STEP_METADATA[step];
          const status = statusByStep[step] ?? "not-started";
          const isActive = step === currentStep;
          const hasErrors = Boolean(errorsByStep[step]) &&
            Object.keys(errorsByStep[step] ?? {}).length > 0;
          const disabled = !canNavigateToStep(status, hasErrors);

          return (
            <li key={step}>
              <button
                type="button"
                data-testid={`sidebar-step-${step}`}
                onClick={() => goToStep(step)}
                disabled={disabled}
                className={cn(
                  "flex w-full items-start gap-3 rounded-lg border border-transparent p-3 text-left transition hover:border-border hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
                  isActive && "border-primary bg-primary/10",
                  hasErrors && status === "blocked" && "border-destructive/50",
                  disabled && !isActive && "opacity-60"
                )}
                aria-current={isActive ? "step" : undefined}
              >
                {statusIcon(status, hasErrors)}
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {metadata.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {metadata.description}
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
