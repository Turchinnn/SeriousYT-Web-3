import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Homepage from "./pages/Homepage";
import SocialLinks from "./pages/SocialLinks";
import Giveaways from "./pages/Giveaways";
import Webshop from "./pages/Webshop";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import Auth from "./pages/Auth";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background flex flex-col">
          <Navbar />
          <main className="flex-1 wiggle-background relative">
            {/* Animated Dark Blue Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-blue-900/10 via-background to-blue-800/10 animate-gradient-shift -z-10"></div>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/social" element={<SocialLinks />} />
              <Route path="/giveaways" element={<Giveaways />} />
              <Route path="/webshop" element={<Webshop />} />
              <Route path="/product/:productId" element={<ProductDetails />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/contact" element={<Contact />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
