import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Menu, User } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import MyAccount from "./MyAccount";
import Cart from "./Cart";

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  // 👇 dodano za vidljivost navbara
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 👇 logika za prikaz navbara samo na home page-u
  useEffect(() => {
    if (location.pathname === "/") {
      // startuje sakriven
      setIsVisible(false);
      let hasScrolledOnce = false;

      const handleScroll = () => {
        if (!hasScrolledOnce && window.scrollY > 50) {
          // čim prvi put skroluje -> pokaži i više ne skrivaj
          setIsVisible(true);
          hasScrolledOnce = true;
          window.removeEventListener("scroll", handleScroll); // prestaj pratiti scroll
        }
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      // na drugim stranicama uvek vidljiv
      setIsVisible(true);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    setUser(null);
    setSession(null);
    setIsAccountOpen(false);
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
    { name: "Social Links", path: "/social" },
    { name: "Giveaways", path: "/giveaways" },
    { name: "Webshop", path: "/webshop" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-lg transition-transform duration-500
      ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 group"
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 
          group-hover:rotate-6 transition-all duration-500 pulse-glow">
              <img
                src="/src/assets/mojlogo.png"
                alt="Serious Logo"
                className="w-9 h-9 object-contain rounded-lg"
              />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-electric-blue-glow bg-clip-text 
          text-transparent group-hover:scale-105 transition-all duration-300">
              Serious
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-500 rounded-lg hover:bg-accent/50 hover-lift glow-on-hover ${
                  location.pathname === item.path
                    ? "text-primary bg-accent/30 shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                style={{ animationDelay: `${index * 0.1}s` } as React.CSSProperties}
                onClick={(e) => {
                  if (item.path === window.location.pathname) {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
              >
                {item.name}
                {location.pathname === item.path && (
                  <div className="absolute inset-0 bg-gradient-primary opacity-10 rounded-lg pulse-glow"></div>
                )}
              </Link>
            ))}

            {/* Cart */}
            <Cart user={user} />

            {/* My Account / Login */}
            {user && session ? (
              <Popover open={isAccountOpen} onOpenChange={setIsAccountOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-gradient-primary/20 border-primary/50 text-primary hover:bg-primary/30 transition-all duration-500 hover:scale-110 magnetic glow-on-hover"
                  >
                    <User className="mr-2 h-4 w-4" />
                    My Account
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-transparent border-none shadow-none shadow-2xl shadow-blue-500/40">
                  <MyAccount user={user} session={session} onLogout={handleLogout} />
                </PopoverContent>
              </Popover>
            ) : (
              <Link to="/auth">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gradient-primary/20 border-primary/50 text-primary hover:bg-primary/30 transition-all duration-500 hover:scale-110 magnetic glow-on-hover"
                >
                  <User className="mr-0 h-4 w-4" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="md:hidden bg-transparent border-border hover:bg-accent/50 hover:border-primary/50 transition-all duration-500 magnetic hover:scale-110"
              >
                <Menu className="h-4 w-4 transition-transform duration-300 hover:rotate-180" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] sm:w-[350px] bg-background/95 backdrop-blur-md border-border/50"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center space-x-3 group">
                    <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center pulse-glow group-hover:scale-110 transition-all duration-300">
                      <span className="text-primary-foreground font-bold text-lg">S</span>
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-electric-blue-glow bg-clip-text text-transparent">
                      Serious
                    </span>
                  </div>
                </div>

                <div className="flex-1 py-6">
                  <div className="flex flex-col space-y-3">
                    {navItems.map((item, index) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={(e) => {
                          if (item.path === window.location.pathname) {
                            e.preventDefault();
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }
                          setIsOpen(false);
                        }}
                        className={`flex items-center px-4 py-3 text-base font-medium transition-all duration-500 rounded-xl hover:bg-accent/50 hover:translate-x-4 hover-lift glow-on-hover ${
                          location.pathname === item.path
                            ? "text-primary bg-accent/30 border-l-4 border-primary shadow-lg shadow-primary/20"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
                      >
                        {item.name}
                      </Link>
                    ))}

                    {/* Mobile My Account / Login */}
                    {user && session ? (
                      <div className="border-t border-border/50 pt-4 mt-4">
                        <MyAccount user={user} session={session} onLogout={handleLogout} />
                      </div>
                    ) : (
                      <Link
                        to="/auth"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center px-4 py-3 text-base font-medium transition-all duration-500 rounded-xl bg-gradient-primary/20 border border-primary/50 text-primary hover:bg-primary/30 hover:translate-x-4 hover-lift glow-on-hover mt-4"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Prijava
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
