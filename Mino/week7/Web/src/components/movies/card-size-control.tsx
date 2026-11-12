import type { CardSize } from "../../stores/view-preference-store";
import { cn } from "../../utils/cn";

interface CardSizeControlProps {
  value: CardSize;
  onChange: (value: CardSize) => void;
}

const options: Array<{ value: CardSize; label: string }> = [
  { value: "comfortable", label: "보통" },
  { value: "compact", label: "작게" },
];

export function CardSizeControl({ value, onChange }: CardSizeControlProps) {
  return (
    <div className="inline-flex rounded-md border border-slate-200 bg-white p-1 shadow-sm" aria-label="영화 카드 크기">
      {options.map((option) => (
        <button
          key={option.value}
          className={cn(
            "cursor-pointer rounded px-3 py-1.5 text-xs font-bold text-slate-500 transition-colors",
            value === option.value && "bg-slate-900 text-white",
          )}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
