import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Menu, User, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import MyAccount from "./MyAccount";
import "@/index.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // 👇 ovdje definiraš admin email
  const ADMIN_EMAIL = "sven.doring12310@gmail.com";

  // --- AUTH ---
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 🚫 Zaštita da samo admin može vidjeti /admin stranicu
  useEffect(() => {
    if (location.pathname.startsWith("/admin") && user && user.email !== ADMIN_EMAIL) {
      navigate("/"); // preusmjeri na Home ako nije admin
    }
  }, [location.pathname, user]);

  // --- SCROLL ANIMACIJA ---
  useEffect(() => {
    if (location.pathname === "/") {
      setIsVisible(false);
      let hasScrolledOnce = false;

      const handleScroll = () => {
        if (!hasScrolledOnce && window.scrollY > 50) {
          setIsVisible(true);
          hasScrolledOnce = true;
          window.removeEventListener("scroll", handleScroll);
        }
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      setIsVisible(true);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    setUser(null);
    setSession(null);
    setIsAccountOpen(false);
  };

  // 👇 Navigacija — dodali smo Admin s ikonicom samo ako je korisnik admin
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
    { name: "Social Links", path: "/social" },
    { name: "Giveaways", path: "/giveaways" },
    ...(user?.email === ADMIN_EMAIL
      ? [{ name: "Admin", path: "/admin", icon: <Shield className="h-4 w-4 mr-2 text-primary" /> }]
      : []),
  ];

  return (
    <nav
      className="fixed top-2 left-1/2 -translate-x-1/2
        w-[90%] sm:w-[85%] md:w-[75%] lg:w-[55%] xl:w-[55%]
        z-50 bg-background/80 backdrop-blur-lg border border-border shadow-xl 
        rounded-2xl overflow-hidden pulse-glow2"
      style={{
        transform: `translate(-50%, ${isVisible ? "0" : "-150%"})`,
        opacity: isVisible ? 1 : 0,
        transition:
          "transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.7s ease-in-out",
      }}
    >
      {/* Glow sloj */}
      <div className="navbar-glow"></div>

      {/* Light sweep sloj */}
      <div className="light-sweep"></div>

      <div className="container mx-auto px-6 py-4 relative z-10">
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
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-500">
              <img
                src="https://i.ibb.co/v4XwnWC0/mojlogo.png"
                alt="Serious Logo"
                className="w-9 h-9 object-contain rounded-lg"
              />
            </div>
            <span className="text-2xl font-bold text-primary group-hover:scale-105 transition-all duration-300">
              Serious
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg hover:bg-accent/40 ${
                  location.pathname === item.path
                    ? "text-primary bg-accent/30 shadow-md"
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
                <span className="flex items-center">
                  {item.icon && item.icon}
                  {item.name}
                </span>
              </Link>
            ))}

            {user && session ? (
              <Popover open={isAccountOpen} onOpenChange={setIsAccountOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary/50 text-primary hover:bg-primary/20 transition-all duration-300"
                  >
                    <User className="mr-2 h-4 w-4" />
                    My Account
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-transparent border-none shadow-none">
                  <MyAccount user={user} session={session} onLogout={handleLogout} />
                </PopoverContent>
              </Popover>
            ) : (
              <Link to="/auth">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary/50 text-primary hover:bg-primary/20 transition-all duration-300"
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
                className="md:hidden bg-transparent border-border hover:bg-accent/40 transition-all duration-300"
              >
                <Menu className="h-4 w-4 transition-transform duration-300" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] sm:w-[350px] bg-background/95 backdrop-blur-md border-border/50"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-lg">S</span>
                    </div>
                    <span className="text-xl font-bold text-primary">Serious</span>
                  </div>
                </div>

                <div className="flex-1 py-6">
                  <div className="flex flex-col space-y-3">
                    {navItems.map((item, index) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center px-4 py-3 text-base font-medium transition-all duration-300 rounded-xl hover:bg-accent/40 ${
                          location.pathname === item.path
                            ? "text-primary bg-accent/30 border-l-4 border-primary shadow-md"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {item.icon && item.icon}
                        {item.name}
                      </Link>
                    ))}

                    {user && session ? (
                      <div className="border-t border-border/50 pt-4 mt-4">
                        <MyAccount user={user} session={session} onLogout={handleLogout} />
                      </div>
                    ) : (
                      <Link
                        to="/auth"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center px-4 py-3 text-base font-medium transition-all duration-300 rounded-xl border border-primary/50 text-primary hover:bg-primary/20 mt-4"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Sign in
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
