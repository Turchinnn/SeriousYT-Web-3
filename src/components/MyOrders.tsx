import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Calendar, MapPin, Phone, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { en } from "zod/v4/locales";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    image_url: string;
  };
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip_code: string;
  created_at: string;
  order_items: OrderItem[];
}

interface MyOrdersProps {
  user: User | null;
}

const MyOrders = ({ user }: MyOrdersProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items(
          id,
          quantity,
          price,
          product:products(
            name,
            image_url
          )
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
    } else if (data) {
      setOrders(data as any);
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/50";
      case "processing":
        return "bg-blue-500/20 text-blue-500 border-blue-500/50";
      case "shipped":
        return "bg-purple-500/20 text-purple-500 border-purple-500/50";
      case "delivered":
        return "bg-green-500/20 text-green-500 border-green-500/50";
      case "cancelled":
        return "bg-red-500/20 text-red-500 border-red-500/50";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "processing":
        return "Processing";
      case "shipped":
        return "Shipped";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">You don't have any ordes</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">My orders</h3>
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="bg-surface-dark border-border">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base text-foreground">
                      Order #{order.order_number}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground flex items-center mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      {format(new Date(order.created_at), "dd. MMMM yyyy. HH:mm", { locale: enUS })}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusText(order.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-2">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        {item.product.image_url && (
                          <img 
                            src={item.product.image_url} 
                            alt={item.product.name}
                            className="w-8 h-8 object-cover rounded"
                          />
                        )}
                        <span className="text-foreground">
                          {item.product.name} x{item.quantity}
                        </span>
                      </div>
                      <span className="text-muted-foreground">
                        €{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Delivery Information */}
                <div className="border-t border-border pt-3 space-y-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-2" />
                    {order.address}, {order.city} {order.zip_code}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Phone className="h-3 w-3 mr-2" />
                    {order.phone}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Mail className="h-3 w-3 mr-2" />
                    {order.email}
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-border pt-3 flex justify-between font-semibold">
                  <span className="text-foreground">Total:</span>
                  <span className="text-primary">€{order.total_amount.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;