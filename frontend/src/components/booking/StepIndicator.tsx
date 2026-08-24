interface StepIndicatorProps {
  current: 1 | 2 | 3;
}

const steps = [
  { id: 1, label: 'انتخاب خدمت' },
  { id: 2, label: 'زمان نوبت' },
  { id: 3, label: 'تایید نهایی' },
];

export function StepIndicator({ current }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-3 sm:gap-6">
      {steps.map((step, idx) => (
        <div key={step.id} className="flex items-center gap-3">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                step.id === current
                  ? 'bg-primary-600 text-white'
                  : step.id < current
                    ? 'bg-primary-100 text-primary-600'
                    : 'bg-gray-100 text-gray-400'
              }`}
            >
              {step.id}
            </div>
            <span className="text-xs text-gray-500 hidden sm:block">{step.label}</span>
          </div>
          {idx < steps.length - 1 && <div className="h-px w-6 sm:w-12 bg-gray-200" />}
        </div>
      ))}
    </div>
  );
}