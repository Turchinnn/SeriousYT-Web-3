import { Button } from "@/components/ui/button";
import { Button2 } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Home, Users, Gift, ShoppingBag, ExternalLink, Mail, PhoneCall, ExternalLinkIcon } from "lucide-react";
import { FaDiscord, FaInstagram, FaYoutube } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { CommandShortcut } from "./ui/command";

const Footer = () => {
  const navigate = useNavigate();

  const navigationLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Contact", path: "/contact", icon: PhoneCall },
    { name: "Social Links", path: "/social", icon: Users },
    { name: "Giveaways", path: "/giveaways", icon: Gift },
    { name: "Webshop", path: "/webshop", icon: ShoppingBag },
  ];

  const socialLinks = [
    { name: "Discord", url: "https://discord.gg/seriousserver", icon: FaDiscord },
    { name: "YouTube", url: "https://www.youtube.com/@serious8288", icon: FaYoutube },
    { name: "Instagram", url: "https://instagram.com/domagojsmud", icon: FaInstagram },
    { name: "Contact Page", path: "/contact", icon: ExternalLinkIcon },
  ];

  return (
    <footer className="bg-surface-dark border-t border-border mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Serious
            </h3>
            <p className="text-muted-foreground">
              Your source for all things about Serious.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4 space-x-0">
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
          <div className="space-y-4 space-y-2">
            <h4 className="text-lg font-semibold text-foreground">Connect</h4>
            <div className="grid grid-cols-2 gap-2">
              {socialLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Button
                    key={link.name}
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(link.url, '_blank')}
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
             onClick={() => navigate('/contact')}>
              
              Contact
            </Button2>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;