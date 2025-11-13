import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Package,
  TrendingUp,
  ShoppingBag,
  ShieldCheck,
  Search,
  LogOut,
  Eye,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { StatCard } from "@/components/admin/StatCard";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { OrderCard } from "@/components/admin/OrderCard";
import { ExportButton } from "@/components/admin/ExportButton";
import { ScrollProgress } from "@/components/ScrollProgress";
import { UserDetailModal } from "@/components/admin/UserDetailModal";

const ADMIN_EMAILS = ["sven.doring12310@gmail.com", "dominikdosen98@gmail.com"];

export default function Admin() {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [usersCount, setUsersCount] = useState(0);
  const [updatingMap, setUpdatingMap] = useState<Record<string, boolean>>({});
  const [orderSearch, setOrderSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userModalOpen, setUserModalOpen] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate("/");
        return;
      }
      if (!ADMIN_EMAILS.includes(data.user.email!)) {
        toast({
          title: "Access Denied",
          description: "You don't have admin permissions",
          variant: "destructive",
        });
        navigate("/");
        return;
      }
      setAuthorized(true);
    };
    checkAdmin();
  }, [navigate]);

  useEffect(() => {
    if (!authorized) return;

    const loadData = async () => {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const currentUser = authData?.user;

        const { data: usersData, count: userCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact" });

        let finalUsers = usersData || [];

        const { data: productsData } = await supabase.from("products").select("*");

        const { data: ordersData } = await supabase
          .from("orders")
          .select(
            `
            id,
            order_number,
            total_amount,
            total,
            status,
            created_at,
            first_name,
            last_name,
            email,
            phone,
            address,
            city,
            zip_code,
            order_items ( quantity, price, products ( name ) )
          `
          )
          .order("created_at", { ascending: false });

        setUsers(finalUsers);
        setUsersCount(userCount || finalUsers.length);
        setProducts(productsData || []);
        setOrders(ordersData || []);
      } catch (e) {
        console.error("Error loading data:", e);
        toast({
          title: "Error",
          description: "Failed to load data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Real-time subscription for orders
    const ordersChannel = supabase
      .channel("orders-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            toast({
              title: "New Order! 🎉",
              description: `Order #${payload.new.order_number || payload.new.id}`,
            });
          }
          // Reload orders
          const { data: ordersData } = await supabase
            .from("orders")
            .select(
              `
              id,
              order_number,
              total_amount,
              total,
              status,
              created_at,
              first_name,
              last_name,
              email,
              phone,
              address,
              city,
              zip_code,
              order_items ( quantity, price, products ( name ) )
            `
            )
            .order("created_at", { ascending: false });
          setOrders(ordersData || []);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
    };
  }, [authorized]);

  const updateOrderStatus = async (id: string, status: string) => {
    setUpdatingMap((p) => ({ ...p, [id]: true }));
    const prev = orders;
    setOrders((curr) => curr.map((o) => (o.id === id ? { ...o, status } : o)));

    const { error } = await supabase.from("orders").update({ status }).eq("id", id);

    if (error) {
      setOrders(prev);
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive",
      });
    } else {
      toast({ title: "Status updated successfully" });
    }
    setUpdatingMap((p) => ({ ...p, [id]: false }));
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete order.",
        variant: "destructive",
      });
    } else {
      setOrders((o) => o.filter((ord) => ord.id !== id));
      toast({ title: "Order deleted successfully" });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (!authorized)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="flex flex-col items-center gap-4 text-slate-200">
          <ShieldCheck className="h-12 w-12 text-admin-primary animate-pulse-glow" />
          <span className="text-xl font-semibold animate-fade-in">Checking permissions...</span>
        </div>
      </div>
    );

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="relative">
          <div className="h-32 w-32 rounded-full border-4 border-slate-800 border-t-admin-primary animate-spin"></div>
          <div className="absolute inset-0 rounded-full bg-admin-primary/30 blur-2xl animate-glow"></div>
        </div>
      </div>
    );

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount ?? o.total ?? 0), 0);

  const filteredOrders = orders.filter((order) => {
    const searchLower = orderSearch.toLowerCase();
    return (
      order.order_number?.toLowerCase().includes(searchLower) ||
      order.first_name?.toLowerCase().includes(searchLower) ||
      order.last_name?.toLowerCase().includes(searchLower) ||
      order.email?.toLowerCase().includes(searchLower) ||
      order.status?.toLowerCase().includes(searchLower)
    );
  });

  const filteredUsers = users.filter((user) => {
    const searchLower = userSearch.toLowerCase();
    return (
      user.email?.toLowerCase().includes(searchLower) ||
      user.first_name?.toLowerCase().includes(searchLower) ||
      user.last_name?.toLowerCase().includes(searchLower) ||
      user.id?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      <ScrollProgress />
      {/* Animated background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%),radial-gradient(circle_at_70%_60%,rgba(96,165,250,0.15),transparent_50%)] animate-glow"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>

      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-admin-primary/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-admin-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mt-16 mb-20 animate-fade-in-scale">
          <div className="flex justify-end mb-4">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="bg-slate-800/60 border-slate-700/50 text-white hover:bg-slate-800/80 hover:border-admin-danger/50 hover:text-admin-danger transition-all"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-admin-primary/20 to-admin-secondary/20 rounded-3xl mb-8 border border-admin-primary/30 shadow-2xl shadow-admin-primary/20 hover:scale-110 transition-transform duration-500">
            <ShoppingBag className="h-16 w-16 text-admin-primary animate-float" />
          </div>
          <div className="flex items-center justify-center gap-3 mb-6">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black bg-gradient-to-r from-admin-primary via-admin-primary-glow to-white bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-slate-400 text-xl max-w-3xl mx-auto font-medium leading-relaxed">
            Monitor your store performance and manage orders with real-time insights
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <StatCard
            title="Total Users"
            value={usersCount}
            icon={Users}
            trend="up"
            trendValue="+12%"
            variant="primary"
          />
          <StatCard
            title="Total Orders"
            value={orders.length}
            icon={ShoppingBag}
            trend="up"
            trendValue="+8%"
            variant="secondary"
          />
          <StatCard
            title="Products"
            value={products.length}
            icon={Package}
            trend="up"
            trendValue="+3%"
            variant="success"
          />
          <StatCard
            title="Total Revenue"
            value={`€${totalRevenue.toFixed(2)}`}
            icon={TrendingUp}
            trend="up"
            trendValue="+23%"
            variant="warning"
          />
        </div>

        {/* Revenue Chart */}
        <div className="mb-16 animate-fade-in" style={{ animationDelay: "300ms" }}>
          <RevenueChart orders={orders} />
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="orders" className="w-full mb-16 animate-fade-in" style={{ animationDelay: "400ms" }}>
          <TabsList className="mb-12 grid w-full max-w-lg mx-auto grid-cols-3 gap-3 bg-slate-900/60 border border-slate-700/50 p-2 backdrop-blur-xl rounded-2xl">
            <TabsTrigger 
              value="orders"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-admin-primary/30 data-[state=active]:to-admin-primary/20 data-[state=active]:text-white data-[state=active]:border-admin-primary/50 transition-all duration-300 rounded-xl font-semibold"
            >
              Orders
            </TabsTrigger>
            <TabsTrigger 
              value="users"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-admin-secondary/30 data-[state=active]:to-admin-secondary/20 data-[state=active]:text-white data-[state=active]:border-admin-secondary/50 transition-all duration-300 rounded-xl font-semibold"
            >
              Users
            </TabsTrigger>
            <TabsTrigger 
              value="products"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-admin-success/30 data-[state=active]:to-admin-success/20 data-[state=active]:text-white data-[state=active]:border-admin-success/50 transition-all duration-300 rounded-xl font-semibold"
            >
              Products
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-6">
              <div className="flex items-center gap-4">
                <div className="h-2 w-16 bg-gradient-to-r from-admin-primary via-admin-primary-glow to-admin-secondary rounded-full shadow-lg shadow-admin-primary/30"></div>
                <h2 className="text-4xl sm:text-5xl font-black text-transparent bg-gradient-to-r from-white to-slate-300 bg-clip-text">Orders</h2>
                <Badge className="bg-admin-primary/20 text-admin-primary-glow border-admin-primary/40 text-lg px-4 py-1 font-bold shadow-lg shadow-admin-primary/20 animate-pulse">
                  {filteredOrders.length}
                </Badge>
              </div>
              <ExportButton data={filteredOrders} filename="orders" type="orders" />
            </div>

            {/* Search */}
            <div className="mb-8 max-w-2xl">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-hover:text-admin-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Search orders by number, customer, email, or status..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-slate-800/60 border border-slate-700/50 rounded-2xl text-slate-200 placeholder-slate-500 focus:border-admin-primary focus:outline-none focus:ring-2 focus:ring-admin-primary/30 transition-all backdrop-blur-xl font-medium hover:bg-slate-800/80"
                />
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <Card className="bg-gradient-to-br from-slate-900/60 to-slate-800/60 border-slate-700/50 backdrop-blur-xl">
                <CardContent className="py-16">
                  <div className="text-center space-y-4">
                    <Package className="h-16 w-16 text-slate-600 mx-auto" />
                    <p className="text-slate-400 text-lg font-medium">
                      {orderSearch ? "No orders match your search." : "No orders found."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredOrders.map((order, idx) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onStatusUpdate={updateOrderStatus}
                    onDelete={deleteOrder}
                    isUpdating={!!updatingMap[order.id]}
                    animationDelay={idx * 50}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-6">
              <div className="flex items-center gap-4">
                <div className="h-2 w-16 bg-gradient-to-r from-admin-secondary via-admin-secondary to-admin-primary rounded-full shadow-lg shadow-admin-secondary/30"></div>
                <h2 className="text-4xl sm:text-5xl font-black text-transparent bg-gradient-to-r from-white to-slate-300 bg-clip-text">Users</h2>
                <Badge className="bg-admin-secondary/20 text-admin-secondary border-admin-secondary/40 text-lg px-4 py-1 font-bold shadow-lg shadow-admin-secondary/20 animate-pulse">
                  {filteredUsers.length}
                </Badge>
              </div>
              <ExportButton data={filteredUsers} filename="users" type="users" />
            </div>

            {/* Search */}
            <div className="mb-8 max-w-2xl">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-hover:text-admin-secondary transition-colors" />
                <input
                  type="text"
                  placeholder="Search users by email, name, or ID..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-slate-800/60 border border-slate-700/50 rounded-2xl text-slate-200 placeholder-slate-500 focus:border-admin-secondary focus:outline-none focus:ring-2 focus:ring-admin-secondary/30 transition-all backdrop-blur-xl font-medium hover:bg-slate-800/80"
                />
              </div>
            </div>

            {filteredUsers.length === 0 ? (
              <Card className="bg-gradient-to-br from-slate-900/60 to-slate-800/60 border-slate-700/50 backdrop-blur-xl">
                <CardContent className="py-16">
                  <div className="text-center space-y-4">
                    <Users className="h-16 w-16 text-slate-600 mx-auto" />
                    <p className="text-slate-400 text-lg font-medium">
                      {userSearch ? "No users match your search." : "No users found."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gradient-to-br from-slate-900/60 to-slate-800/60 border-slate-700/50 backdrop-blur-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-slate-300">
                    <thead className="bg-slate-800/80 text-slate-400 text-sm backdrop-blur-xl">
                      <tr>
                        <th className="p-5 font-bold uppercase tracking-wider">ID</th>
                        <th className="p-5 font-bold uppercase tracking-wider">Email</th>
                        <th className="p-5 font-bold uppercase tracking-wider">Name</th>
                        <th className="p-5 font-bold uppercase tracking-wider">Created</th>
                        <th className="p-5 font-bold uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u, idx) => (
                        <tr
                          key={u.id}
                          className="border-t border-slate-800/50 hover:bg-slate-800/40 transition-all duration-300 animate-fade-in"
                          style={{ animationDelay: `${idx * 30}ms` }}
                        >
                          <td className="p-5 font-mono text-xs text-slate-500 font-semibold">
                            {u.id.slice(0, 8)}...
                          </td>
                          <td className="p-5 font-medium">{u.email}</td>
                          <td className="p-5 font-medium">
                            {u.first_name || u.last_name
                              ? `${u.first_name || ""} ${u.last_name || ""}`.trim()
                              : "N/A"}
                          </td>
                          <td className="p-5 text-slate-400 font-medium">
                            {new Date(u.created_at).toLocaleDateString()}
                          </td>
                          <td className="p-5">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedUser(u);
                                setUserModalOpen(true);
                              }}
                              className="bg-admin-primary/10 border-admin-primary/30 text-admin-primary hover:bg-admin-primary/20 hover:border-admin-primary/50 transition-all"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-6">
              <div className="flex items-center gap-4">
                <div className="h-2 w-16 bg-gradient-to-r from-admin-success via-admin-success to-admin-primary rounded-full shadow-lg shadow-admin-success/30"></div>
                <h2 className="text-4xl sm:text-5xl font-black text-transparent bg-gradient-to-r from-white to-slate-300 bg-clip-text">Product Catalog</h2>
                <Badge className="bg-admin-success/20 text-admin-success border-admin-success/40 text-lg px-4 py-1 font-bold shadow-lg shadow-admin-success/20 animate-pulse">
                  {products.length}
                </Badge>
              </div>
              <ExportButton data={products} filename="products" type="products" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((p, idx) => (
                <Card
                  key={p.id}
                  className="group relative bg-gradient-to-br from-slate-900/95 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 hover:border-admin-success/50 transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-admin-success/20 overflow-hidden animate-fade-in-scale"
                  style={{ animationDelay: `${idx * 30}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-admin-success/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <CardContent className="relative z-10 p-6 space-y-5">
                    <div className="p-4 bg-gradient-to-br from-admin-success/20 to-admin-success/10 rounded-2xl border border-admin-success/30 inline-flex group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                      <Package className="h-8 w-8 text-admin-success" />
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-admin-success transition-colors line-clamp-2 min-h-[3.5rem] leading-tight">
                      {p.name}
                    </h3>

                    <div className="flex justify-between items-end pt-4 border-t border-slate-700/50">
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-widest mb-2 font-bold">
                          Price
                        </p>
                        <p className="text-3xl font-black text-admin-success">€{p.price}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500 uppercase tracking-widest mb-2 font-bold">
                          Stock
                        </p>
                        <p
                          className={`text-2xl font-black ${
                            p.stock > 10
                              ? "text-admin-success"
                              : p.stock > 0
                              ? "text-admin-warning"
                              : "text-admin-danger"
                          }`}
                        >
                          {p.stock}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <UserDetailModal
        user={selectedUser}
        open={userModalOpen}
        onOpenChange={setUserModalOpen}
      />
    </div>
  );
}
