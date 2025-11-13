import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

interface RevenueChartProps {
  orders: any[];
}

export function RevenueChart({ orders }: RevenueChartProps) {
  // Group orders by date and calculate daily revenue
  const revenueByDate = orders.reduce((acc, order) => {
    const date = new Date(order.created_at).toLocaleDateString();
    const amount = order.total_amount ?? order.total ?? 0;
    acc[date] = (acc[date] || 0) + amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(revenueByDate)
    .map(([date, revenue]) => ({ date, revenue }))
    .slice(-7) // Last 7 days
    .reverse();

  return (
    <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 overflow-hidden">
      <CardHeader className="border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-admin-primary/20 to-admin-primary/10 rounded-2xl border border-admin-primary/30">
            <TrendingUp className="h-6 w-6 text-admin-primary" />
          </div>
          <CardTitle className="text-2xl font-black text-white">Revenue Overview</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
            <XAxis
              dataKey="date"
              stroke="rgba(148, 163, 184, 0.5)"
              tick={{ fill: "rgba(148, 163, 184, 0.7)" }}
            />
            <YAxis
              stroke="rgba(148, 163, 184, 0.5)"
              tick={{ fill: "rgba(148, 163, 184, 0.7)" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.95)",
                border: "1px solid rgba(148, 163, 184, 0.2)",
                borderRadius: "12px",
                color: "#fff",
              }}
              formatter={(value: any) => [`€${value.toFixed(2)}`, "Revenue"]}
            />
            <Bar dataKey="revenue" fill="hsl(var(--admin-primary))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
