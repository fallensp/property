import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StepCard } from '@/app/(listing)/listing/create/components/step-card';

describe('StepCard', () => {
  it('renders content and controls', () => {
    const handleNext = vi.fn();
    const handleBack = vi.fn();

    render(
      <StepCard
        title="Test step"
        description="Step description"
        onNext={handleNext}
        onPrevious={handleBack}
        statusMessage="All good"
      >
        <p>Body content</p>
      </StepCard>
    );

    expect(screen.getByText('Test step')).toBeInTheDocument();
    expect(screen.getByText('Step description')).toBeInTheDocument();
    expect(screen.getByText('Body content')).toBeInTheDocument();
    expect(screen.getByText('All good')).toBeInTheDocument();

    const nextButton = screen.getByTestId('wizard-next');
    expect(nextButton).toBeEnabled();
  });

  it('respects disabled state and triggers navigation callbacks', async () => {
    const user = userEvent.setup();
    const handleNext = vi.fn();
    const handleBack = vi.fn();

    render(
      <StepCard
        title="Disabled step"
        description=""
        onNext={handleNext}
        onPrevious={handleBack}
        isNextDisabled
      >
        <div />
      </StepCard>
    );

    const backButton = screen.getByTestId('wizard-back');
    await user.click(backButton);
    expect(handleBack).toHaveBeenCalledTimes(1);

    const nextButton = screen.getByTestId('wizard-next');
    expect(nextButton).toBeDisabled();
    await user.click(nextButton);
    expect(handleNext).not.toHaveBeenCalled();
  });
});
