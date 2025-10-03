import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  firstName: z.string().min(2, "Ime mora imati najmanje 2 karaktera"),
  lastName: z.string().min(2, "Prezime mora imati najmanje 2 karaktera"),
  email: z.string().email("Neispravna email adresa"),
  phone: z.string().min(9, "Neispravan broj telefona"),
  address: z.string().min(5, "Adresa mora imati najmanje 5 karaktera"),
  city: z.string().min(2, "Grad mora imati najmanje 2 karaktera"),
  zipCode: z.string().min(5, "Poštanski broj mora imati najmanje 5 karaktera"),
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

  useEffect(() => {
    // Check for user session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        toast({
          title: "Prijavite se",
          description: "Morate biti prijavljeni da biste naručili",
          variant: "destructive"
        });
        navigate("/auth");
        return;
      }
      setUser(session.user);
      
      // Pre-fill email if available
      if (session.user.email) {
        form.setValue("email", session.user.email);
      }
    });
  }, [navigate, form]);

  const onSubmit = async (data: CheckoutFormData) => {
    if (!user || cartItems.length === 0) {
      toast({
        title: "Greška",
        description: "Korpa je prazna",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Create order
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
          status: "pending"
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product.price
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart
      await clearCart();

      toast({
        title: "Porudžbina uspešna!",
        description: `Vaša porudžbina #${order.order_number} je primljena`,
      });

      navigate("/");
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Greška",
        description: "Nije moguće završiti porudžbinu",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

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
              Nazad na prodavnicu
            </Button>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Završi kupovinu
            </h1>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="md:col-span-2">
              <Card className="bg-surface-dark border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Informacije za dostavu</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Unesite svoje podatke za dostavu
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
                              <FormLabel>Ime</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Petar" 
                                  {...field} 
                                  className="bg-background border-border"
                                />
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
                              <FormLabel>Prezime</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Petrović" 
                                  {...field}
                                  className="bg-background border-border"
                                />
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
                              <Input 
                                type="email" 
                                placeholder="petar@example.com" 
                                {...field}
                                className="bg-background border-border"
                              />
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
                            <FormLabel>Broj telefona</FormLabel>
                            <FormControl>
                              <Input 
                                type="tel" 
                                placeholder="+381 60 123 4567" 
                                {...field}
                                className="bg-background border-border"
                              />
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
                            <FormLabel>Adresa</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Knez Mihailova 10" 
                                {...field}
                                className="bg-background border-border"
                              />
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
                              <FormLabel>Grad</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Beograd" 
                                  {...field}
                                  className="bg-background border-border"
                                />
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
                              <FormLabel>Poštanski broj</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="11000" 
                                  {...field}
                                  className="bg-background border-border"
                                />
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
                        {loading ? (
                          "Checking out..."
                        ) : (
                          <>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Make an order
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="bg-surface-dark border-border sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center text-foreground">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Pregled porudžbine
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      Vaša korpa je prazna
                    </p>
                  ) : (
                    <>
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{item.product.name}</p>
                            <p className="text-muted-foreground">Količina: {item.quantity}</p>
                          </div>
                          <p className="font-medium text-foreground">
                            €{(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                      <Separator className="bg-border" />
                      <div className="flex justify-between font-bold text-lg">
                        <span className="text-foreground">Ukupno:</span>
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