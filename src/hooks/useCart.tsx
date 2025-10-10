import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { logAddToCart } from "@/lib/utils"; // ✅ added Discord log import

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
  };
}

/**
 * Custom React hook for managing the shopping cart
 */
export const useCart = (user: User | null) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Load cart items whenever user logs in/out
  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      setCartItems([]);
      setCartCount(0);
    }
  }, [user]);

  /**
   * Fetch all cart items for the logged-in user
   */
  const fetchCartItems = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("cart_items")
      .select(`
        id,
        product_id,
        quantity,
        product:products(
          id,
          name,
          price,
          image_url
        )
      `)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching cart:", error);
    } else if (data) {
      setCartItems(data as any);
      setCartCount(data.reduce((sum, item) => sum + item.quantity, 0));
    }
    setLoading(false);
  };

  /**
   * Add an item to the cart or update quantity if it already exists
   */
  const addToCart = async (
    productId: string,
    variations?: Record<string, string>,
    quantity: number = 1
  ) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "You need to be signed in to add products to your cart.",
        variant: "destructive",
      });
      return;
    }

    const existingItem = cartItems.find((item) => item.product_id === productId);

    if (existingItem) {
      
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: existingItem.quantity + quantity })
        .eq("id", existingItem.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update cart item.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Cart updated",
          description: "Product quantity has been updated.",
        });

        // ✅ Log to Discord
        await logAddToCart(user, {
          name: existingItem.product.name,
          price: existingItem.product.price,
        });

        fetchCartItems();
      }
    } else {
      const { error } = await supabase.from("cart_items").insert({
        user_id: user.id,
        product_id: productId,
        quantity,
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to add product to cart.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Added to cart",
          description: "Product has been added to your cart.",
        });

        // ✅ Fetch product details to log
        const { data: productData } = await supabase
          .from("products")
          .select("name, price")
          .eq("id", productId)
          .single();

        if (productData) await logAddToCart(user, productData);

        fetchCartItems();
      }
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    const { error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", itemId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update item quantity.",
        variant: "destructive",
      });
    } else {
      fetchCartItems();
    }
  };

  const removeFromCart = async (itemId: string) => {
    const { error } = await supabase.from("cart_items").delete().eq("id", itemId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove product from cart.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Removed",
        description: "Product has been removed from your cart.",
      });
      fetchCartItems();
    }
  };

  const clearCart = async () => {
    if (!user) return;

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to clear cart.",
        variant: "destructive",
      });
    } else {
      setCartItems([]);
      setCartCount(0);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  };

  return {
    cartItems,
    cartCount,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice,
    refetch: fetchCartItems,
  };
};
