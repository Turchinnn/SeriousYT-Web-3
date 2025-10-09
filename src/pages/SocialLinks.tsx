import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, MessageCircle, Users, Video, Zap } from "lucide-react";
import { FaDiscord, FaDownload, FaInstagram, FaKickstarter, FaTiktok, FaYoutube, FaYoutubeSquare } from "react-icons/fa";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";

// Configurable social media links

const Social = () => {
  useEffect(() => {
    const counters = document.querySelectorAll('.animate-count');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target as HTMLElement;
          const target = parseFloat(counter.dataset.target || '0');
          const increment = target / 100;
          let current = 0;
          
          const updateCounter = () => {
            current += increment;
            if (current < target) {
              counter.innerText = current.toFixed(1);
              requestAnimationFrame(updateCounter);
            } else {
              counter.innerText = target.toString();
            }
          };
          
          updateCounter();
          observer.unobserve(counter);
        }
      });
    });
    
    counters.forEach(counter => observer.observe(counter));
    
    return () => observer.disconnect();
  }, []);
  }

const socialPlatforms = [
  {
    name: "YouTube",
    description: "Subscribe on Serious's YouTube Channel!",
    icon: FaYoutube,
    url: "https://youtube.com/@serious8288",
    subscribers: "serious8288",
    color: "bg-[#FF0000]",
    isActive: true
  },
  {
    name: "Kick",
    description: "Watch Serious's streams on Kick!",
    icon: FaKickstarter,
    url: "https://kick.com/serious-yt",
    followers: "Serious_YT",
    color: "bg-[#00ff00]",
    isActive: true
  },
  {
    name: "Discord",
    description: "Join our discord community!",
    icon: FaDiscord,
    url: "https://discord.gg/seriousserver",
    members: "serious_yt",
    color: "bg-[#5865F2]",
    isActive: true
  },
  {
    name: "Instagram",
    description: "Follow him on Instagram!",
    icon: FaInstagram,
    url: "https://www.instagram.com/domagojsmud/",
    followers: "@domagojsmud",
    color: "bg-gradient-to-r from-[#833AB4] to-[#FD1D1D]",
    isActive: true
  },
  {
    name: "TikTok",
    description: "Follow him on TikTok!",
    icon: FaTiktok,
    url: "https://www.tiktok.com/@_seriousyt",
    followers: "_seriousyt",
    color: "bg-gradient-to-r from-[#000022] to-[#210023]",
    isActive: true
  },

];



const SocialLinks = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden pt-20">
      <div className="container mx-auto px-6 py-16"></div>

      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-background to-blue-700/20 animate-gradient-shift"></div>
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-background/90"></div>
      
      <div className="container mx-auto pb-20 px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Connect with us
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay connected with the Serious community across all platforms. Follow us for the latest updates, 
            exclusive content, and instant notifications about new giveaways.
          </p>
        </div>

        {/* Social Platform Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto ">
          {socialPlatforms.map((platform, index) => {
            const IconComponent = platform.icon;
            return (
              <Card 
                key={platform.name}
                className={`bg-surface-dark border-border hover:border-primary/70 transition-all duration-700 group hover:shadow-2xl hover:shadow-primary/40 hover-lift animate-fade-in glow-on-hover transform-gpu ${
                  !platform.isActive ? 'opacity-60' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${platform.color} rounded-full flex items-center justify-center transition-all duration-3000 animate-pulse`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-foreground flex items-center gap-2">
                        {platform.name}
                        {!platform.isActive && (
                          <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                            Soon
                          </span>
                        )}
                      </CardTitle>
                      <div className="text-sm text-primary font-semibold">
                        {platform.members || platform.followers || platform.subscribers}
                        {platform.members ? ' ' : platform.followers ? ' ' : ' '}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground mb-6">
                    {platform.description}
                  </CardDescription>
                  
                  {platform.isActive ? (
                    <Button 
                      className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-primary/40 magnetic glow-on-hover transform-gpu"
                      onClick={() => window.open(platform.url, '_blank')}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Visit {platform.name}
                    </Button>
                  ) : (
                    <Button 
                      disabled
                      className="w-full"
                      variant="outline"
                    >
                      Soon!
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-surface-dark border border-border rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              Be the first to know
            </h3>
            <p className="text-muted-foreground mb-6">
              Join our Discord community to be the first to hear about new giveaways and exclusive events.
            </p>
            <Button 
              size="lg" 
              className="bg-[#5865F2] hover:bg-[#008dca]/90 text-white mb-2 transition-all duration-500 hover:hover-lift"
              onClick={() => window.open("https://discord.gg/seriousserver", '_blank')}
            >
              <FaDiscord className="mr-2 h-5 w-5" />
              Pridruži se Discord-u
            </Button>
            <h3 className="text-2xl font-bold mb-4 text-foreground mt-10">
              Or download our app!
            </h3>
             <p className="text-muted-foreground mb-6">
              Be first to get notified for our new giveaways, stream notifications, and much more!
            </p>
              <Button 
              size="lg" 
              className="bg-[#5865F2] hover:bg-[#008dca]/90 text-white mb-2 transition-all duration-500 hover:hover-lift duration-3000 animate-pulse"
            >
              <FaDownload className="mr-2 h-5 w-5" />
              App is comming soon!
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialLinks;