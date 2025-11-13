import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: "up" | "down";
  trendValue?: string;
  variant: "primary" | "secondary" | "success" | "warning";
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  variant,
}: StatCardProps) {
  const variantStyles = {
    primary: {
      bg: "from-admin-primary/20 to-admin-primary/10",
      border: "border-admin-primary/30",
      icon: "text-admin-primary",
      glow: "shadow-admin-primary/20",
    },
    secondary: {
      bg: "from-admin-secondary/20 to-admin-secondary/10",
      border: "border-admin-secondary/30",
      icon: "text-admin-secondary",
      glow: "shadow-admin-secondary/20",
    },
    success: {
      bg: "from-admin-success/20 to-admin-success/10",
      border: "border-admin-success/30",
      icon: "text-admin-success",
      glow: "shadow-admin-success/20",
    },
    warning: {
      bg: "from-admin-warning/20 to-admin-warning/10",
      border: "border-admin-warning/30",
      icon: "text-admin-warning",
      glow: "shadow-admin-warning/20",
    },
  };

  const style = variantStyles[variant];

  return (
    <Card
      className={`group bg-gradient-to-br ${style.bg} backdrop-blur-xl border ${style.border} hover:scale-105 transition-all duration-500 hover:shadow-2xl ${style.glow} overflow-hidden`}
    >
      <CardContent className="p-6 relative">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`p-3 bg-gradient-to-br ${style.bg} rounded-2xl border ${style.border} group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500`}
          >
            <Icon className={`h-6 w-6 ${style.icon}`} />
          </div>
          {trend && trendValue && (
            <div
              className={`text-sm font-bold ${
                trend === "up" ? "text-admin-success" : "text-admin-danger"
              }`}
            >
              {trendValue}
            </div>
          )}
        </div>
        <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">
          {title}
        </p>
        <p className="text-4xl font-black text-white">{value}</p>
      </CardContent>
    </Card>
  );
}
