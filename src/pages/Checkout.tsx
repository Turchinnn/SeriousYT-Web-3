import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Separator } from "@/components/ui/separator";
import { ShoppingCart, ArrowLeft, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/useCart";
import { User } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const checkoutSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(9, "Invalid phone number"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  zipCode: z.string().min(4, "Zip code must be at least 4 characters"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const { cartItems, getTotalPrice, clearCart } = useCart(user);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      zipCode: "",
    },
  });

  // ✅ Check session only once (no duplicate login events)
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session?.user) {
        toast({
          title: "Please sign in",
          description: "You must be logged in to complete checkout.",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }
      setUser(data.session.user);
      if (data.session.user.email) {
        form.setValue("email", data.session.user.email);
      }
    };
    checkSession();
  }, [navigate, form]);

  const onSubmit = async (data: CheckoutFormData) => {
    if (!user || cartItems.length === 0) {
      toast({
        title: "Error",
        description: "Your cart is empty.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // ✅ 1. Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total_amount: getTotalPrice(),
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          zip_code: data.zipCode,
          status: "pending",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // ✅ 2. Create order items
      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

       // ✅ 3. Send Discord notification (in Croatian, but formatted as an embed)
       const discordMessage = {
         embeds: [
           {
             title: "🛒 Nova narudžba zaprimljena!",
             color: 0x2ecc71, // zelena boja
             description: `
       👤 **Kupac:** ${data.firstName} ${data.lastName}
       📧 **Email:** ${data.email}

       📞 **Telefon:** ${data.phone}
       🏠 **Adresa:** ${data.address}, 
       🏠 **Grad, Zipcode:** ${data.city} (${data.zipCode})
             `, 
             fields: [
               {
                 name: "📦 Broj artikala",
                 value: `${cartItems.length}`,
                 inline: true,
               },
               {
                 name: "💰 Ukupno",
                 value: `€${getTotalPrice().toFixed(2)}`,
                 inline: true,
               },
               {
                 name: "🧾 Detalji narudžbe",
                 value: cartItems
                   .map(
                     (item) =>
                       `• **${item.product.name}** x${item.quantity} — €${(
                         item.product.price * item.quantity
                       ).toFixed(2)}`
                   )
                   .join("\n"),
               },
             ],
             footer: {
               text: "T-Notify • Serious Webshop",
             },
             timestamp: new Date().toISOString(),
           },
         ],
       };
       

      await fetch("https://discord.com/api/webhooks/1426347668992688209/59Ls79-tG3Az7ot-zb4qphVqX_0XGq6QuccLak1JEXnUNPtIJvgiMzQdQT0gdS9yMaI9", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(discordMessage),
      });

      // ✅ 4. Clear cart and show success message
      await clearCart();

      toast({
        title: "Order placed successfully!",
        description: "Thank you for your purchase. You’ll receive an email confirmation soon.",
      });

      navigate("/");
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Error",
        description: "Something went wrong while processing your order.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const totalPrice = getTotalPrice();

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/webshop")}
              className="mb-4 hover:bg-primary/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to webshop
            </Button>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Complete your order
            </h1>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Checkout form */}
            <div className="md:col-span-2">
              <Card className="bg-surface-dark border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Delivery Information</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Please fill in your delivery details carefully.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john.doe@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="+385 91 234 5678" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Example Street 10" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="Zagreb" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="zipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Zip Code</FormLabel>
                              <FormControl>
                                <Input placeholder="10000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90"
                        disabled={loading || cartItems.length === 0}
                      >
                        {loading ? "Processing order..." : (
                          <>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Confirm Order
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            {/* Order summary */}
            <div>
              <Card className="bg-surface-dark border-border sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center text-foreground">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      Your cart is empty.
                    </p>
                  ) : (
                    <>
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{item.product.name}</p>
                            <p className="text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-medium text-foreground">
                            €{(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                      <Separator className="bg-border" />
                      <div className="flex justify-between font-bold text-lg">
                        <span className="text-foreground">Total:</span>
                        <span className="text-primary">€{totalPrice.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
