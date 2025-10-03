import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Clock, Package, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/useCart";
import { User } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock_quantity: number;
  is_active: boolean;
  is_available?: boolean; // New field for availability status
}

const Webshop = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [user, setUser] = useState<User | null>(null);
  const { addToCart, refetch: refetchCart } = useCart(user);

  useEffect(() => {
    // Check for user session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    fetchProducts();

    return () => subscription.unsubscribe();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "It's not possible to load products",
        variant: "destructive"
      });
    } else if (data) {
      setProducts(data);
    }
    setLoading(false);
  };

  const categories = ["all", ...Array.from(new Set(products.map(p => p.category)))];
  
  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const handleAddToCart = async (productId: string) => {
    if (!user) {
      toast({
        title: "Sign Up",
        description: "You need to be logged in to shop!",
        variant: "destructive"
      });
      return;
    }
    await addToCart(productId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pt-20">
      <div className="container mx-auto px-6 py-16"></div>

      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-background to-blue-700/20 animate-gradient-shift"></div>
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-background/90"></div>
      
      <div className="container mx-auto px-5 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 animate-glow">
            <Package className="h-12 w-12 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Serious Webshop
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Exclusive Serious Merch
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category 
                ? "bg-gradient-primary text-primary-foreground" 
                : "border-primary/50 hover:bg-primary/10"}
            >
              {category === "all" ? "Svi proizvodi" : category}
            </Button>
          ))}
        </div>

        {/* Products or Under Construction */}
        {filteredProducts.length === 0 ? (
          <Card className="bg-surface-dark border-border max-w-2xl mx-auto">
            <CardHeader>
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Clock className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl text-foreground">Webshop in development</CardTitle>
              </div>
              <CardDescription className="text-lg text-muted-foreground">
                We are currently working on adding new products to this category.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Planned Launch: <span className="text-primary font-semibold">SOON</span>
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <Card 
                key={product.id} 
                className="bg-surface-dark border-border hover:border-primary/70 transition-all duration-700 group hover:shadow-2xl hover:shadow-primary/40 hover-lift animate-fade-in glow-on-hover transform-gpu"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="w-full h-48 bg-muted rounded-lg mb-4 overflow-hidden relative group/image">
                    <img 
                      src={product.image_url || "/placeholder.png"} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover/image:scale-110 transition-all duration-700"
                    />
                    {/* Availability badges */}
                    {product.is_available === false || product.stock_quantity === 0 ? (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-destructive/90 text-destructive-foreground">
                          Unavaible
                        </Badge>
                      </div>
                    ) : product.stock_quantity > 0 && product.stock_quantity <= 10 && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-warning/80 text-warning-foreground">
                          Only {product.stock_quantity} on board
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-foreground group-hover:text-primary transition-colors">
                        {product.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {product.category}
                      </p>
                    </div>
                    <Badge className="bg-primary/20 text-primary border-primary/50 font-bold text-lg px-3 py-1">
                      €{product.price}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {product.description}
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-gradient-primary text-primary-foreground hover:opacity-90 transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-primary/40 magnetic glow-on-hover transform-gpu"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    <Button 
                      variant="outline"
                      size="icon"
                      className="border-primary text-primary hover:bg-primary/10"
                      onClick={() => handleAddToCart(product.id)}
                      disabled={product.stock_quantity === 0 || product.is_available === false}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Back to Homepage */}
        <div className="mt-24 mb-16 text-center">
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => window.open("/", '_self')}
            className="border-primary text-primary hover:bg-primary/10"
          >
            Back to home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Webshop;