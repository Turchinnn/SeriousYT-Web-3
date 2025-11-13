import { Button } from "@/components/ui/button";
import { Button2 } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Home, Users, Gift, PhoneCall, ExternalLinkIcon } from "lucide-react";
import { FaDiscord, FaInstagram, FaYoutube } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const navigationLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Contact", path: "/contact", icon: PhoneCall },
    { name: "Social Links", path: "/social", icon: Users },
    { name: "Giveaways", path: "/giveaways", icon: Gift },
  ];

  const socialLinks = [
    { name: "Discord", url: "https://discord.gg/seriousserver", icon: FaDiscord },
    { name: "YouTube", url: "https://www.youtube.com/@serious8288", icon: FaYoutube },
    { name: "Instagram", url: "https://instagram.com/domagojsmud", icon: FaInstagram },
    { name: "Contact", path: "/contact", icon: ExternalLinkIcon },
  ];

  return (
    // 🔥 Footer je iznad svega, potpuno neprozirne tamne pozadine
    <footer className="relative z-[10] mt-auto bg-[#000a0f] text-foreground border-t border-border shadow-2xl">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Serious
            </h3>
            <p className="text-muted-foreground">
              Your source for everything related to Serious.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2">
              {navigationLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Button
                    key={link.path}
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(link.path)}
                    className="justify-start text-muted-foreground hover:text-primary hover:bg-primary/10"
                  >
                    <IconComponent className="mr-1 h-4 w-4" />
                    {link.name}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Connect</h4>
            <div className="grid grid-cols-2 gap-2">
              {socialLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Button
                    key={link.name}
                    variant="ghost"
                    size="sm"
                    onClick={() => link.url ? window.open(link.url, "_blank") : navigate(link.path!)}
                    className="justify-start text-muted-foreground hover:text-primary hover:bg-primary/10 w-full"
                  >
                    <IconComponent className="mr-2 h-4 w-4" />
                    {link.name}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; 2025 Serious. All rights reserved.</p>
          <p>Website built by Turchin</p>
          <p>App built by Dos3</p>

          <div className="flex space-x-4 mt-4 md:mt-0">
            <Button variant="link" size="sm" className="text-muted-foreground hover:text-primary">
              Privacy Policy
            </Button>
            <Button variant="link" size="sm" className="text-muted-foreground hover:text-primary">
              Terms of Service
            </Button>
            <Button2
              variant="link"
              size="sm"
              className="text-muted-foreground hover:text-primary"
              onClick={() => navigate("/contact")}
            >
              Contact
            </Button2>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
