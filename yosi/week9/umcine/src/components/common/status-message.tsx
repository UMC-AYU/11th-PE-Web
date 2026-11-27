import { cn } from "../../utils/cn";

type StatusMessageProps = {
  children: React.ReactNode;
  tone?: "default" | "error";
};

export function StatusMessage({ children, tone = "default" }: StatusMessageProps) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cn("py-24 text-center", tone === "error" ? "text-red-500" : "text-gray-500")}
    >
      {children}
    </p>
  );
}
