import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Package, MapPin, Phone, Mail, Calendar, CreditCard } from "lucide-react";

interface OrderCardProps {
  order: any;
  onStatusUpdate: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
  animationDelay: number;
}

const statusConfig = {
  pending: { label: "Pending", color: "bg-admin-warning/20 text-admin-warning border-admin-warning/40" },
  processing: { label: "Processing", color: "bg-admin-primary/20 text-admin-primary border-admin-primary/40" },
  shipped: { label: "Shipped", color: "bg-admin-secondary/20 text-admin-secondary border-admin-secondary/40" },
  delivered: { label: "Delivered", color: "bg-admin-success/20 text-admin-success border-admin-success/40" },
  cancelled: { label: "Cancelled", color: "bg-admin-danger/20 text-admin-danger border-admin-danger/40" },
};

export function OrderCard({ order, onStatusUpdate, onDelete, isUpdating, animationDelay }: OrderCardProps) {
  const statusInfo = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
  const total = order.total_amount ?? order.total ?? 0;

  return (
    <Card
      className="group bg-gradient-to-br from-slate-900/95 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 hover:border-admin-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-admin-primary/20 overflow-hidden animate-fade-in"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <CardContent className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Package className="h-5 w-5 text-admin-primary" />
              <h3 className="text-xl font-bold text-white">
                Order #{order.order_number || order.id.slice(0, 8)}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Calendar className="h-4 w-4" />
              {new Date(order.created_at).toLocaleString()}
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(order.id)}
            className="bg-admin-danger/10 border-admin-danger/30 text-admin-danger hover:bg-admin-danger/20 hover:border-admin-danger/50 transition-all"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Customer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-slate-800/40 rounded-xl border border-slate-700/30">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="font-bold text-slate-400 min-w-[70px]">Customer:</div>
              <div className="text-white font-semibold">
                {order.first_name || order.last_name
                  ? `${order.first_name || ""} ${order.last_name || ""}`.trim()
                  : "N/A"}
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-slate-400" />
              <div className="text-slate-300 truncate">{order.email || "N/A"}</div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-slate-400" />
              <div className="text-slate-300">{order.phone || "N/A"}</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
              <div className="text-slate-300">
                {order.address && order.city ? (
                  <>
                    {order.address}
                    <br />
                    {order.zip_code && `${order.zip_code}, `}
                    {order.city}
                  </>
                ) : (
                  "N/A"
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        {order.order_items && order.order_items.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">Items</div>
            <div className="space-y-2">
              {order.order_items.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-slate-800/40 rounded-lg border border-slate-700/30"
                >
                  <div className="flex-1">
                    <div className="text-white font-semibold">
                      {item.products?.name || "Unknown Product"}
                    </div>
                    <div className="text-sm text-slate-400">
                      Quantity: {item.quantity} × €{item.price}
                    </div>
                  </div>
                  <div className="text-admin-success font-bold">
                    €{(item.quantity * item.price).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-slate-400" />
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">Total</div>
              <div className="text-2xl font-black text-admin-success">€{total.toFixed(2)}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={order.status}
              onValueChange={(value) => onStatusUpdate(order.id, value)}
              disabled={isUpdating}
            >
              <SelectTrigger className="w-[160px] bg-slate-800/60 border-slate-700/50">
                <SelectValue>
                  <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                {Object.entries(statusConfig).map(([value, config]) => (
                  <SelectItem key={value} value={value}>
                    <Badge className={config.color}>{config.label}</Badge>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
