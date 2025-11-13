// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
import ScrollToTop from "@/components/ScrollToTop";
import Admin from "./pages/Admin";

// ✅ Dodaj import tvoje komponente
import AnimatedBackground from "@/components/AnimatedBackground";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">

            {/* 🔥 Zamijenjeno: Animated background umjesto statičkog gradienta */}
            <div className="fixed inset-0 -z-10">
              <AnimatedBackground />
            </div>

            {/* Navbar */}
            <Navbar />

            {/* Glavni sadržaj */}
            <main className="flex-1 wiggle-background relative z-10 scroll-smooth">
              {/* iOS blur overlays */}
              <div className="ios-blur-overlay top-blur-fade" />
              <div className="ios-blur-overlay bottom-blur-fade" />

              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/social" element={<SocialLinks />} />
                <Route path="/giveaways" element={<Giveaways />} />
                <Route path="/webshop" element={<Webshop />} />
                <Route path="/product/:productId" element={<ProductDetails />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            {/* Footer */}
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
