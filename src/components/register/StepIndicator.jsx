export default function StepIndicator({ currentStep, totalSteps, labels }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8" dir="rtl">
      {labels.map((label, i) => {
        const step = i + 1;
        const isActive = step === currentStep;
        const isDone = step < currentStep;
        return (
          <div key={i} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                isDone ? "bg-green-500 text-white" :
                isActive ? "bg-yellow-400 text-slate-900" :
                "bg-white/20 text-white/50"
              }`}>
                {isDone ? "✓" : step}
              </div>
              <span className={`text-xs font-medium transition-all ${isActive ? "text-yellow-400" : isDone ? "text-green-400" : "text-white/40"}`}>
                {label}
              </span>
            </div>
            {i < labels.length - 1 && (
              <div className={`w-8 h-0.5 mb-5 transition-all ${isDone ? "bg-green-500" : "bg-white/20"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}