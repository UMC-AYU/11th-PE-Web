import { cn } from "@/utils/cn";

// 입력칸 아래에 보여줄 안내 문구
export type Feedback = { tone: "error" | "success" | "info"; message: string } | null;

// 안내 문구 색에 맞춰 입력칸 테두리 색을 바꿔요. icon이 있으면 왼쪽 여백을 넓혀요.
export function inputClass(feedback: Feedback, { withIcon = false } = {}) {
  return cn(
    "h-11 w-full min-w-0 flex-1 rounded-md border bg-white px-3 text-sm outline-none focus:border-gray-900 disabled:bg-gray-100 disabled:text-gray-500",
    withIcon && "pl-10",
    feedback?.tone === "error" ? "border-red-400" : "border-gray-200",
  );
}

type FormFieldProps = {
  id: string;
  label: string;
  feedback?: Feedback;
  children: React.ReactNode;
};

// 라벨 + 입력칸 + 안내 문구를 한 묶음으로 보여줘요.
export function FormField({ id, label, feedback = null, children }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      {children}
      <p
        id={`${id}-feedback`}
        // 오류는 바로 읽어 주고, 나머지 안내는 조용히 읽어 줘요.
        role={feedback?.tone === "error" ? "alert" : "status"}
        className={cn(
          "mt-1.5 min-h-5 text-xs",
          feedback?.tone === "error" && "text-red-500",
          feedback?.tone === "success" && "text-blue-600",
          feedback?.tone === "info" && "text-gray-500",
        )}
      >
        {feedback?.message}
      </p>
    </div>
  );
}

// 입력칸 왼쪽에 아이콘을 겹쳐 보여줘요. (예: 메일, 자물쇠)
export function InputIcon({ src }: { src: string }) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 opacity-40"
    />
  );
}
