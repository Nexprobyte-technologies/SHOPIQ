import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-dark">{title}</h1>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "primary",
  sub,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: "primary" | "success" | "danger" | "warning" | "purple" | "info" | "dark";
  sub?: string;
}) {
  const tones: Record<string, string> = {
    primary: "bg-primary-50 text-primary",
    success: "bg-success-50 text-success",
    danger: "bg-danger-50 text-danger",
    warning: "bg-warning-50 text-warning",
    purple: "bg-purple-50 text-purple",
    info: "bg-info-50 text-info",
    dark: "bg-gray-800 text-white",
  };
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="mt-2 text-2xl font-bold text-dark">{value}</p>
            {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
          </div>
          <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", tones[tone])}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <Card>
      <CardContent className="p-10 text-center">
        <p className="font-semibold text-gray-600">{title}</p>
        {hint && <p className="mt-1 text-sm text-gray-400">{hint}</p>}
      </CardContent>
    </Card>
  );
}
