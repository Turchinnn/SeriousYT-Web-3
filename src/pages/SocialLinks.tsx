import { Button } from "@/components/ui/button";
import { Button2 } from "@/components/ui/button2";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Card2, Card2Content, Card2Description, Card2Header, Card2Title } from "@/components/ui/card2";
import { ExternalLink, MessageCircle, Users, Video, Zap } from "lucide-react";
import { FaDiscord, FaDownload, FaInstagram, FaKickstarter, FaTiktok, FaYoutube, FaYoutubeSquare } from "react-icons/fa";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollProgress } from '@/components/ScrollProgress';
import AnimatedBackground from "@/components/AnimatedBackground";

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
    <div className="min-h-screen relative overflow-hidden pt-6">
      <ScrollProgress />

      {/* Animated background */}
      <div className="absolute inset-0 -z-50 pointer-events-none">
        <AnimatedBackground />
      </div>

      <div className="container mx-auto pb-20 px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 mt-32">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-primary">
            Connect with us
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay connected with the Serious community across all platforms.
            Follow us for the latest updates, exclusive content, and instant
            notifications about new giveaways.
          </p>
        </div>

        {/* Social Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {socialPlatforms.map((platform, index) => {
            const IconComponent = platform.icon;
            return (
              <Card2
                key={platform.name}
                variant="glass-primary"
                className={`border-primary hover:border-primary/70 transition-all duration-700 group hover:shadow-2xl hover:shadow-primary/40 hover-lift animate-fade-in glow-on-hover transform-gpu ${
                  !platform.isActive ? "opacity-60" : ""
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Card2Header>
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 ${platform.color} rounded-full flex items-center justify-center transition-all duration-3000 animate-pulse`}
                    >
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
                        {platform.members ||
                          platform.followers ||
                          platform.subscribers}
                      </div>
                    </div>
                  </div>
                </Card2Header>
                <Card2Content>
                  <Card2Description className="text-muted-foreground mb-6">
                    {platform.description}
                  </Card2Description>

                  {platform.isActive ? (
                    <Button2
                      variant="glass-accent"
                      className="w-full border-accent hover:opacity-90 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/40 magnetic glow-on-hover transform-gpu"
                      onClick={() => window.open(platform.url, "_blank")}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Visit {platform.name}
                    </Button2>
                  ) : (
                    <Button2 disabled className="w-full" variant="outline">
                      Soon!
                    </Button2>
                  )}
                </Card2Content>
              </Card2>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-glass border border-primary rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              Be the first to know
            </h3>
            <p className="text-muted-foreground mb-6">
              Join our Discord community to be the first to hear about new
              giveaways and exclusive events.
            </p>

            {/* Discord Button */}
            <Button2
              variant="glass-accent"
              size="lg"
              className="bg-[#0d256d] hover:bg-[#008dca]/90 text-white mb-2 transition-all duration-500 hover:hover-lift"
              onClick={() =>
                window.open("https://discord.gg/seriousserver", "_blank")
              }
            >
              <div className="flex items-center group">
                <FaDiscord
                  className="mr-2 h-5 w-5 transition-transform duration-700 group-hover:rotate-[360deg]"
                  style={{ transformOrigin: "center" }}
                />
                <span>Pridruži se Discord-u</span>
              </div>
            </Button2>

            {/* App Download Section */}
            <h3 className="text-2xl font-bold mb-4 text-foreground mt-10">
              Or download our app!
            </h3>
            <p className="text-muted-foreground mb-6">
              Be first to get notified for our new giveaways, stream
              notifications, and much more!
            </p>

            {/* Download Button */}
            <Button2
              variant="glass-accent"
              size="lg"
              className="hover:bg-[#003a78]/90 text-white mb-2 transition-all duration-3000 hover:hover-lift animate-pulse"
            >
              <div className="flex items-center group">
                <FaDownload
                  className="mr-2 h-5 w-5 transition-transform duration-3000 group-hover:rotate-[360deg]"
                  style={{ transformOrigin: "center" }}
                />
                <span>Coming Soon!</span>
              </div>
            </Button2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialLinks;