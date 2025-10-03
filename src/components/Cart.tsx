import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "@/hooks/useCart";
import { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface CartProps {
  user: User | null;
}

const Cart = ({ user }: CartProps) => {
  const navigate = useNavigate();
  const { cartItems, cartCount, updateQuantity, removeFromCart, getTotalPrice } = useCart(user);

  const handleCheckout = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    navigate("/checkout");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="relative">
          <Button 
            variant="outline" 
            size="sm"
            className="bg-blue-500/20 border-blue-500/50 text-blue-500 hover:bg-blue-500/30 transition-all duration-500 hover:scale-110 magnetic glow-on-hover"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
          {cartCount > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-blue-500 text-white text-xs font-bold min-w-[20px] z-[200] border-2 border-white pointer-events-none heartbeat-glow"
            >
              {cartCount}
            </Badge>
          )}
        </div>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg bg-background border-border">
        <SheetHeader>
          <SheetTitle className="text-foreground">Moja Korpa</SheetTitle>
          <SheetDescription className="text-muted-foreground">
            {cartItems.length === 0 ? "Vaša korpa je prazna" : `${cartItems.length} proizvod(a) u korpi`}
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-8 space-y-4 max-h-[60vh] overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">There is no products in cart.</p>
              <p className="text-muted-foreground mt-4">If you added something to the cart and it didn’t show up, try refreshing the page.</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 bg-surface-dark p-4 rounded-lg">
                <img 
                  src={item.product.image_url || "/placeholder.png"} 
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-foreground">{item.product.name}</h4>
                  <p className="text-sm text-primary">€{item.product.price}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium w-8 text-center text-foreground">
                    {item.quantity}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-8 w-8 p-0"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="mt-6 space-y-4 border-t border-border pt-4">
            <div className="flex justify-between text-lg font-semibold">
              <span className="text-foreground">Total:</span>
              <span className="text-primary">€{getTotalPrice().toFixed(2)}</span>
            </div>
            <Button 
              className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90"
              onClick={handleCheckout}
            >
              Continue to checkout
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;