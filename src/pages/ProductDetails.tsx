import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, ArrowLeft, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/useCart";
import { User } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";
import { getProductImages } from "@/data/productImages";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock_quantity: number;
  is_active: boolean;
}

// Mock variations data - in a real app this would come from the database
const getProductVariations = (productId: string, category: string) => {
  const baseVariations = {
    color: ["Black", "White", "Gray", "Blue"],
    size: ["XS", "S", "M", "L", "XL", "XXL"]
  };

  if (category.toLowerCase().includes("majica") || category.toLowerCase().includes("t-shirt")) {
    return {
      color: baseVariations.color,
      size: baseVariations.size
    };
  }
  
  if (category.toLowerCase().includes("kačket") || category.toLowerCase().includes("cap")) {
    return {
      color: baseVariations.color,
      size: ["Jedna veličina"]
    };
  }

  if (category.toLowerCase().includes("gaming") || category.toLowerCase().includes("oprema")) {
    return {
      color: baseVariations.color.slice(0, 2) // Only black and white for gaming gear
    };
  }

  return {
    color: baseVariations.color,
    size: baseVariations.size
  };
};

const ProductDetails = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>({});
  const [currentImage, setCurrentImage] = useState<string>("");
  const { addToCart } = useCart(user);

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

    if (productId) {
      fetchProduct();
    }

    return () => subscription.unsubscribe();
  }, [productId]);

  const fetchProduct = async () => {
    if (!productId) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .eq("is_active", true)
      .single();

    if (error) {
    console.error("Error fetching product:", error);
    toast({
      title: "Error",
      description: "Unable to load product",
      variant: "destructive"
      });
    } else if (data) {
      setProduct(data);
      // Set initial image
      const productImages = getProductImages(data.id, data.category);
      setCurrentImage(data.image_url || productImages.default);
    }
    setLoading(false);
  };

  const variations = product ? getProductVariations(product.id, product.category) : {};
  const variationKeys = Object.keys(variations);
  const productImages = product ? getProductImages(product.id, product.category) : { default: "", variations: {} };

  const handleVariationChange = (variationType: string, value: string) => {
    setSelectedVariations(prev => ({
      ...prev,
      [variationType]: value
    }));

    // Update image when color variation changes
    if (variationType === "color" && productImages.variations[value]) {
      setCurrentImage(productImages.variations[value]);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Sign In",
        description: "You must be signed in to make purchases",
        variant: "destructive"
      });
      return;
    }

    if (!product) return;

    // Check if all variations are selected
     const missingVariations = variationKeys.filter(key => !selectedVariations[key]);
     if (missingVariations.length > 0) {
       toast({
         title: "Variation Selection",
         description: `Please select: ${missingVariations.join(", ")}`,
         variant: "destructive"
       });
       return;
     }

    addToCart(product.id, selectedVariations);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <Card className="bg-surface-dark border-border max-w-md mx-auto">
          <CardHeader>
          <CardTitle className="text-foreground text-center">Product not found</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              onClick={() => navigate("/webshop")}
              className="w-full border-primary text-primary hover:bg-primary/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to webshop
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="container mx-auto px-6 py-16">
        <Button 
          variant="outline" 
          onClick={() => navigate("/webshop")}
          className="mb-8 border-primary text-primary hover:bg-primary/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to webshop
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="w-full aspect-square bg-muted rounded-lg overflow-hidden relative group">
              <img 
                src={currentImage || product.image_url || "/placeholder.png"} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
              />
              {product.stock_quantity > 0 && product.stock_quantity <= 10 && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-warning/80 text-warning-foreground">
                    Only {product.stock_quantity} on board
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4 mb-6">
                <Badge className="bg-primary/20 text-primary border-primary/50 font-bold text-2xl px-4 py-2">
                  €{product.price}
                </Badge>
                <div className="flex items-center text-muted-foreground">
                  <Package className="h-4 w-4 mr-2" />
                  <span>{product.stock_quantity} na stanju</span>
                </div>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Product Variations */}
            {variationKeys.length > 0 && (
              <Card className="bg-surface-dark border-border">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">Izaberite opcije</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {variationKeys.map((variationType) => (
                    <div key={variationType} className="space-y-2">
                      <label className="text-sm font-medium text-foreground capitalize">
                        {variationType === "color" ? "Boja" : variationType === "size" ? "Veličina" : variationType}
                      </label>
                      <Select 
                        value={selectedVariations[variationType] || ""} 
                        onValueChange={(value) => handleVariationChange(variationType, value)}
                      >
                        <SelectTrigger className="w-full bg-background border-border text-foreground">
                          <SelectValue placeholder={`Izaberite ${variationType === "color" ? "boju" : variationType === "size" ? "veličinu" : variationType}`} />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-border">
                          {variations[variationType].map((option: string) => (
                            <SelectItem key={option} value={option} className="text-foreground hover:bg-muted">
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Add to Cart */}
            <div className="space-y-4">
              <Button 
                className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 transition-all duration-500 hover:scale-105 text-lg py-6"
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
                size="lg"
              >
                {product.stock_quantity === 0 ? (
                  "Nema na stanju"
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Dodaj u korpu - €{product.price}
                  </>
                )}
              </Button>
              
              {variationKeys.length > 0 && (
                <p className="text-sm text-muted-foreground text-center">
                  * Molimo izaberite sve opcije pre dodavanja u korpu
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;