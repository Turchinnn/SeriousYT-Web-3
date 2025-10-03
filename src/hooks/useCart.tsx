import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";

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

export const useCart = (user: User | null) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      setCartItems([]);
      setCartCount(0);
    }
  }, [user]);

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

  const addToCart = async (productId: string, variations?: Record<string, string>, quantity: number = 1) => {
    if (!user) {
      toast({
        title: "Prijavite se",
        description: "Morate biti prijavljeni da biste dodali proizvode u korpu",
        variant: "destructive"
      });
      return;
    }

    const existingItem = cartItems.find(item => item.product_id === productId);

    if (existingItem) {
      // Update quantity
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: existingItem.quantity + quantity })
        .eq("id", existingItem.id);

      if (error) {
        toast({
          title: "Greška",
          description: "Nije moguće ažurirati korpu",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Korpa ažurirana",
          description: "Količina proizvoda je ažurirana",
        });
        fetchCartItems();
      }
    } else {
      // Add new item
      const { error } = await supabase
        .from("cart_items")
        .insert({ 
          user_id: user.id, 
          product_id: productId, 
          quantity 
        });

      if (error) {
        toast({
          title: "Greška",
          description: "Nije moguće dodati proizvod u korpu",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Dodato u korpu",
          description: "Proizvod je dodat u vašu korpu",
        });
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
        title: "Greška",
        description: "Nije moguće ažurirati količinu",
        variant: "destructive"
      });
    } else {
      fetchCartItems();
    }
  };

  const removeFromCart = async (itemId: string) => {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", itemId);

    if (error) {
      toast({
        title: "Greška",
        description: "Nije moguće ukloniti proizvod",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Uklonjeno",
        description: "Proizvod je uklonjen iz korpe",
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
        title: "Greška",
        description: "Nije moguće isprazniti korpu",
        variant: "destructive"
      });
    } else {
      setCartItems([]);
      setCartCount(0);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
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
    refetch: fetchCartItems
  };
};