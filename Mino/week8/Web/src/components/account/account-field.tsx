import { useId, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "../../utils/cn";

interface AccountFieldProps extends ComponentPropsWithoutRef<"input"> {
  label: string;
  error?: string;
  status?: string;
  hint?: string;
  action?: ReactNode;
}

export function AccountField({ label, error, status, hint, action, ...input }: AccountFieldProps) {
  const id = useId();
  const message = error || status || hint;

  return (
    <div>
      <label className="mb-1.5 block text-sm font-bold" htmlFor={id}>{label}</label>
      <div className="relative">
        <input
          {...input}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? `${id}-message` : undefined}
          className={cn("h-[46px] w-full rounded-lg border border-slate-300 bg-white px-3 text-sm placeholder:text-slate-500 focus:border-blue-600 focus:outline-2 focus:outline-blue-600/25 disabled:bg-slate-100 read-only:bg-slate-100", action && "pr-24", error && "border-red-600")}
        />
        {action && <div className="absolute inset-y-0 right-1 flex items-center">{action}</div>}
      </div>
      <p id={`${id}-message`} aria-live="polite" className={cn("text-xs break-keep", message && "mt-1.5", error ? "text-red-700" : status ? "text-emerald-700" : "text-slate-600")}>{message}</p>
    </div>
  );
}
