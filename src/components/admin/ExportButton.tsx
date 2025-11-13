import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ExportButtonProps {
  data: any[];
  filename: string;
  type: "orders" | "users" | "products";
}

export function ExportButton({ data, filename, type }: ExportButtonProps) {
  const exportToCSV = () => {
    if (!data || data.length === 0) {
      toast({
        title: "No data to export",
        description: "There is no data available to export.",
        variant: "destructive",
      });
      return;
    }

    let headers: string[];
    let rows: string[][];

    if (type === "orders") {
      headers = ["Order Number", "Date", "Customer", "Email", "Phone", "Total", "Status"];
      rows = data.map((order) => [
        order.order_number || order.id.slice(0, 8),
        new Date(order.created_at).toLocaleString(),
        `${order.first_name || ""} ${order.last_name || ""}`.trim() || "N/A",
        order.email || "N/A",
        order.phone || "N/A",
        (order.total_amount ?? order.total ?? 0).toFixed(2),
        order.status || "pending",
      ]);
    } else if (type === "users") {
      headers = ["ID", "Email", "First Name", "Last Name", "Created"];
      rows = data.map((user) => [
        user.id,
        user.email || "",
        user.first_name || "",
        user.last_name || "",
        new Date(user.created_at).toLocaleDateString(),
      ]);
    } else {
      headers = ["ID", "Name", "Price", "Stock"];
      rows = data.map((product) => [
        product.id,
        product.name || "",
        product.price?.toString() || "0",
        product.stock?.toString() || "0",
      ]);
    }

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: `${data.length} records exported to CSV.`,
    });
  };

  return (
    <Button
      onClick={exportToCSV}
      variant="outline"
      className="bg-admin-success/10 border-admin-success/30 text-admin-success hover:bg-admin-success/20 hover:border-admin-success/50 transition-all"
    >
      <Download className="h-4 w-4 mr-2" />
      Export CSV
    </Button>
  );
}
