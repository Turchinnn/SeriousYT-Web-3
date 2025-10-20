import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Users,
  Eye,
  Package,
  TrendingUp,
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  Loader,
  ShieldCheck,
} from "lucide-react";
import { toast } from "../hooks/use-toast";
import { useNavigate } from "react-router-dom";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

// ✅ Lista admin emailova
const ADMIN_EMAILS = ["sven.doring12310@gmail.com", "dominikdosen98@gmail.com"];

const STATUSES = ["pending", "processing", "delivered", "cancelled"];

const statusConfig = {
  delivered: {
    class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-emerald-500/20",
    icon: CheckCircle,
    gradient: "from-emerald-500/20 to-transparent",
  },
  processing: {
    class: "bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-amber-500/20",
    icon: Loader,
    gradient: "from-amber-500/20 to-transparent",
  },
  cancelled: {
    class: "bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-rose-500/20",
    icon: XCircle,
    gradient: "from-rose-500/20 to-transparent",
  },
  pending: {
    class: "bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-blue-500/20",
    icon: Clock,
    gradient: "from-blue-500/20 to-transparent",
  },
};

const statusBadgeClass = (status: string) =>
  statusConfig[status as keyof typeof statusConfig]?.class || statusConfig.pending.class;

const StatusIcon = ({ status }: { status: string }) => {
  const Icon = statusConfig[status as keyof typeof statusConfig]?.icon || Clock;
  return <Icon className="h-4 w-4" />;
};

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [usersCount, setUsersCount] = useState(0);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [updatingMap, setUpdatingMap] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  // ✅ Provjera pristupa admin stranici
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user || !ADMIN_EMAILS.includes(user.email)) {
        // ❌ nije admin — nema pristup
        navigate("/404", { replace: true });
        return;
      }

      setAuthorized(true);
    };

    checkAdmin();
  }, [navigate]);

  // ✅ Učitavanje podataka samo ako je admin
  useEffect(() => {
    if (!authorized) return;

    const loadData = async () => {
      try {
        const { count: userCount, error: usersError } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });
        if (usersError) throw usersError;

        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select(`
            id,
            user_id,
            order_number,
            total_amount,
            total,
            status,
            created_at,
            updated_at,
            first_name,
            last_name,
            email,
            phone,
            address,
            city,
            zip_code,
            order_items (
              id,
              quantity,
              price,
              products ( id, name )
            )
          `)
          .order("created_at", { ascending: false });
        if (ordersError) throw ordersError;

        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("*");
        if (productsError) throw productsError;

        setUsersCount(userCount || 0);
        setOrders(ordersData || []);
        setProducts(productsData || []);
      } catch (err: any) {
        console.error("Admin error:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [authorized]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingMap((s) => ({ ...s, [orderId]: true }));
    const prevOrders = orders;
    setOrders((curr) => curr.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));

    try {
      const { error: updateError } = await supabase
        .from("orders")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", orderId);

      if (updateError) {
        setOrders(prevOrders);
        toast({
          title: "Error",
          description: `Failed to update status: ${updateError.message}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: `Order status updated to "${newStatus}".`,
        });
      }
    } catch (err: any) {
      setOrders(prevOrders);
      toast({
        title: "Error",
        description: "An error occurred while updating status.",
        variant: "destructive",
      });
    } finally {
      setUpdatingMap((s) => ({ ...s, [orderId]: false }));
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount ?? o.total ?? 0), 0);

  if (!authorized) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950 text-white">
        <ShieldCheck className="h-6 w-6 text-blue-400 mr-2" />
        <p>Checking admin permissions...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-4 border-slate-800 border-t-blue-500 animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-red-400">
        <XCircle className="h-6 w-6 mr-2" />
        <p>{error}</p>
      </div>
    );
  }


return (
  <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%),radial-gradient(circle_at_70%_60%,rgba(147,51,234,0.1),transparent_50%)]"></div>
    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>

    <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* HEADER */}
      <div className="text-center mt-24 mb-16 animate-fade-in">
        <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl mb-6 border border-blue-500/20 shadow-lg shadow-blue-500/10">
          <ShoppingBag className="h-12 w-12 text-blue-400" />
        </div>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 text-transparent bg-clip-text">
          Admin Dashboard
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Monitor your store performance and manage orders in real-time
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {/* USERS */}
        <Card className="group bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 hover:border-blue-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors duration-300">
                <Users className="h-7 w-7 text-blue-400" />
              </div>
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </div>
            <h3 className="text-4xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">{usersCount}</h3>
            <p className="text-slate-400 text-sm font-medium">Total Users</p>
          </CardContent>
        </Card>

        {/* ORDERS */}
        <Card className="group bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 hover:border-purple-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 group-hover:bg-purple-500/20 transition-colors duration-300">
                <Eye className="h-7 w-7 text-purple-400" />
              </div>
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </div>
            <h3 className="text-4xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">{orders.length}</h3>
            <p className="text-slate-400 text-sm font-medium">Total Orders</p>
          </CardContent>
        </Card>

        {/* PRODUCTS */}
        <Card className="group bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors duration-300">
                <Package className="h-7 w-7 text-emerald-400" />
              </div>
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </div>
            <h3 className="text-4xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">{products.length}</h3>
            <p className="text-slate-400 text-sm font-medium">Products</p>
          </CardContent>
        </Card>

        {/* REVENUE */}
        <Card className="group bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 hover:border-amber-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 group-hover:bg-amber-500/20 transition-colors duration-300">
                <TrendingUp className="h-7 w-7 text-amber-400" />
              </div>
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </div>
            <h3 className="text-4xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
              €{totalRevenue.toFixed(2)}
            </h3>
            <p className="text-slate-400 text-sm font-medium">Total Revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* --- RECENT ORDERS --- */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Recent Orders</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {orders.map((order, idx) => (
            <Card
              key={order.id}
              className="group bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl relative overflow-hidden"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${
                  statusConfig[order.status as keyof typeof statusConfig]?.gradient ||
                  statusConfig.pending.gradient
                } opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
              ></div>

              <CardHeader className="relative z-10 flex flex-row items-start justify-between gap-4 pb-4">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge className="bg-blue-500/10 text-blue-300 border-blue-500/30 shadow-sm">
                      #{order.order_number ?? order.id}
                    </Badge>
                    <Badge
                      className={`${statusBadgeClass(order.status)} flex items-center gap-1.5 shadow-sm`}
                    >
                      <StatusIcon status={order.status} />
                      {order.status}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <select
                    id={`status-${order.id}`}
                    value={order.status || "pending"}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    disabled={!!updatingMap[order.id]}
                    className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-lg px-3 py-1.5 text-sm text-slate-200 hover:border-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s} className="bg-slate-800">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </CardHeader>

              <CardContent className="relative z-10 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Customer</p>
                    <p className="text-white font-semibold">
                      {order.first_name} {order.last_name}
                    </p>
                    <p className="text-sm text-slate-400 mt-1">{order.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Contact</p>
                    <p className="text-white font-semibold">{order.phone || "N/A"}</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                    Shipping Address
                  </p>
                  <p className="text-white font-medium">{order.address}</p>
                  <p className="text-slate-400 text-sm">
                    {order.city}, {order.zip_code}
                  </p>
                </div>

                <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Order Items</p>
                    <p className="text-lg font-bold text-blue-400">
                      €{(order.total_amount ?? order.total ?? 0).toFixed(2)}
                    </p>
                  </div>

                  {order.order_items?.length > 0 ? (
                    <ul className="space-y-2">
                      {order.order_items.map((item: any) => (
                        <li
                          key={item.id}
                          className="flex justify-between items-center text-sm p-2 bg-slate-900/50 rounded-lg"
                        >
                          <span className="text-slate-300">
                            {item.products?.name ?? item.product_id ?? "Unknown product"}
                          </span>
                          <span className="text-slate-400 font-medium">
                            {item.quantity} × €{item.price}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-500 text-sm">No items</p>
                  )}

                  <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="h-3.5 w-3.5" />
                    {new Date(order.created_at).toLocaleString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* PRODUCT CATALOG */}
      <div className="pb-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-1 w-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"></div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Product Catalog</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p, idx) => (
            <Card
              key={p.id}
              className="group bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/10 relative overflow-hidden"
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="relative z-10 p-6 space-y-4">
                <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 inline-flex">
                  <Package className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2 min-h-[3.5rem]">
                  {p.name || p.title}
                </h3>

                <div className="flex justify-between items-end pt-2 border-t border-slate-700/50">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Price</p>
                    <p className="text-2xl font-bold text-emerald-400">{p.price} €</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Stock</p>
                    <p
                      className={`text-xl font-semibold ${
                        (p.stock ?? 0) > 10
                          ? "text-emerald-400"
                          : (p.stock ?? 0) > 0
                          ? "text-amber-400"
                          : "text-rose-400"
                      }`}
                    >
                      {p.stock ?? "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  </div>
);
}
