import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Eye, PlayCircle, TrendingUp, Mail, Instagram, MessageCircle, Award, ExternalLink } from "lucide-react";
import { FaDiscord, FaInstagram } from "react-icons/fa";
import { useEffect } from "react";

const Contact = () => {
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

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-background to-blue-700/20 animate-gradient-shift"></div>
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-background/90"></div>
      
      <div className="container mx-auto px-5 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-20 bg-gradient-primary bg-clip-text text-transparent">
          </h1>
          
          {/* Profile Picture with Glow */}
          <div className="flex justify-center transform-all duration-2000 animate-float">
            <div className="relative">
              <img 
                src="@/assets/mojlogo.png" 
                alt="logo" 
                className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-primary shadow-2xl shadow-primary/40 hover:scale-110 transition-transform duration-1200 animate-pulse"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-primary transition-transform duration-1200 opacity-30 blur-x1 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Bilingual About Section */}
        <div className="relative mb-36">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-px h-full bg-gradient-to-t from-primary/50 via-primary to-primary/50 transform-all duration-1200 animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Croatian Version */}
            <Card className="bg-surface-dark/80 backdrop-blur-sm border-border hover:border-primary/100 transition-all duration-500 hover-lift overflow-hidden glow-on-hover">
              <CardHeader>
                <Badge className="w-fit mb-2 bg-primary/20 text-primary">Hrvatski</Badge>
                <CardTitle className="text-3xl text-foreground">O Meni</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-primary/1 to-transparent transform-all duration-20"></div>
                <div className="relative z-10">
                  <p className="text-muted-foreground text-lg leading-relaxed mb-5">
                    Serious je uspješni YouTube kanal. Na kanalu emitira live sadržaj zabavnog karaktera
                    s jakim naglaskom na interakciju s publikom, što gradi aktivnu i angažiranu zajednicu.
                  </p>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-5">
                    Svojim sadržajem privukao je brojne ljude i stekao nekolicinu
                    uspješnih suradnji. Kanal je aktivan i redovno postavlja nove materijale kako bi
                    zadržao interes gledatelja. 
                  </p>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-32">
                    Cilj kanala je da gradi zabavanu i zdravu zajednicu, a kroz to i uspješne suradnje sa sponzorima
                    koji dijele iste vrjednosti.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* English Version */}
            <Card className="bg-surface-dark/80  backdrop-blur-sm border-border hover:border-primary/100 transition-all duration-500 hover-lift overflow-hidden glow-on-hover">
              <CardHeader>
                <Badge className="w-fit mb-2 bg-primary/20 text-primary">English</Badge>
                <CardTitle className="text-3xl text-foreground">About Me</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-primary/1 to-transparent transform -skew-x- "></div>
                <div className="relative z-10">
                  <p className="text-muted-foreground text-lg leading-relaxed mb-5">
                    Serious is a successful YouTube channel streaming live entertainment content 
                    with strong focus on audience interaction, building an active and engaged community.
                  </p>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-5">
                    Through its content, it has attracted many people and secured several successful 
                    collaborations. The channel is active and regularly posts new material to keep viewers interested.
                  </p>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-32">
                    The goal is to build a fun and healthy community, while also creating successful 
                    partnerships with sponsors who share the same values.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

       <div className="mb-20">
         <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
           Channel Analytics
         </h2>
       
         {/* Wrapper koji centrira grid */}
         <div className="flex justify-center">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             
             <Card className="bg-surface-dark/80 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-500 hover:scale-105 group hover-lift glow-on-hover">
               <CardContent className="p-6">
                 <div className="flex items-center justify-between mb-4">
                   <Users className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                   <TrendingUp className="h-5 w-5 text-green-500" />
                 </div>
                 <h3 className="text-3xl font-bold text-foreground mb-2 animate-count" data-target="4.5">0 K</h3>
                 <p className="text-muted-foreground">K Total Subscribers</p>
                 <p className="text-sm text-green-500 mt-2">+ (growth %) this month</p>
               </CardContent>
             </Card>
       
             <Card className="bg-surface-dark/80 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-500 hover:scale-105 group hover-lift glow-on-hover">
               <CardContent className="p-6">
                 <div className="flex items-center justify-between mb-4">
                   <Eye className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                   <TrendingUp className="h-5 w-5 text-green-500" />
                 </div>
                 <h3 className="text-3xl font-bold text-foreground mb-2">
                   <span className="animate-count" data-target="1.28">0</span> K
                 </h3>
                 <p className="text-muted-foreground">Avg. Views</p>
                 <p className="text-sm text-green-500 mt-2">+8% rate</p>
               </CardContent>
             </Card>
       
             <Card className="bg-surface-dark/80 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-500 hover:scale-105 group hover-lift glow-on-hover">
               <CardContent className="p-6">
                 <div className="flex items-center justify-between mb-4">
                   <PlayCircle className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                   <TrendingUp className="h-5 w-5 text-green-500" />
                 </div>
                 <h3 className="text-3xl font-bold text-foreground mb-2">
                   <span className="animate-count" data-target="+30.2">0</span> K
                 </h3>
                 <p className="text-muted-foreground">Monthly Views</p>
                 <p className="text-sm text-green-500 mt-2">+14% than last month</p>
               </CardContent>
             </Card>
       
           </div>
         </div>
       </div>

        {/* Our partners */}
        <div className="mb-24">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground ">Our Partners</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 mx-auto gap-6 ">
            {[
              { 
                name: "Clash GG", 
                category: "CS2 Case Opening Site",
                url: "https://clash.gg",
                image: "/src/assets/clashgg3.jpg"
              },
              { 
                name: "Crypto Casino", 
                category: "Gambling Site",
                url: "https://www.logitechg.com",
                image: "/src/assets/casino2.png"
              },              
              { 
                name: "Hydro Wash", 
                category: "Pressure Washing Company",
                url: "https://hydrowash.hr",
                image: "/src/assets/hydrowash2.jpg"
              }
            ].map((sponsor, index) => (
              <Card 
                key={index} 
                className="bg-surface-dark/60 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-500 hover:scale-105 group overflow-hidden hover-lift glow-on-hover"
              >
                <div className="aspect-square relative group">
                  <img 
                    src={sponsor.image} 
                    alt={sponsor.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent opacity-40 group-hover:opacity-20 transition-opacity"></div>
                </div>
            
                {/* Tekst ispod slike */}
                <CardContent className="p-4">
                  <div className="text-lg md:text-xl lg:text-2xl font-bold text-center text-foreground/90 group-hover:text-primary transition-colors shadow-lg">
                    {sponsor.name}
                  </div>
                  <p className="text-sm text-muted-foreground text-center mt-2">{sponsor.category}</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full mt-2 border-primary/30 hover:bg-primary/10 hover:border-primary transition-all duration-300 group glow-on-hover"
                    onClick={() => window.open(sponsor.url, '_blank')}
                  >
                    Visit Website
                    <ExternalLink className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>


{/* Contact Section */}
<div className="pb-32 pt-12">
  <h2 className="text-4xl font-bold text-center mb-12 text-foreground">Get in Touch</h2>
  <div className="max-w-4xl mx-auto">
    <Card className="bg-surface-dark/80 backdrop-blur-sm border-border">
      <CardContent className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Business Email */}
          <Button 
            variant="outline" 
            className="h-auto flex-col p-6 border-primary/50 hover:bg-primary/10 hover:border-primary transition-all duration-500 group hover-lift glow-on-hover"
            onClick={() => window.location.href = 'mailto:domagoj.smud1@gmail.com'}
          >
            <Mail className="h-8 w-8 mb-3 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-lg font-semibold text-foreground">Business Email</span>
            <span className="text-sm text-muted-foreground mt-2">domagoj.smud1@gmail.com</span>
          </Button>

          {/* Instagram */}
          <Button 
            variant="outline" 
            className="h-auto flex-col p-6 border-primary/50 hover:bg-primary/10 hover:border-primary transition-all duration-500 group hover-lift glow-on-hover"
            onClick={() => window.open('https://instagram.com/domagojsmud', '_blank')}
          >
            <FaInstagram className="h-8 w-8 mb-3 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-lg font-semibold text-foreground">Instagram</span>
            <span className="text-sm text-muted-foreground mt-2">@domagojsmud</span>
          </Button>

          {/* Discord */}
          <Button 
            variant="outline" 
            className="h-auto flex-col p-6 border-primary/50 hover:bg-primary/10 hover:border-primary transition-all duration-500 group hover-lift glow-on-hover"
            onClick={() => window.open('https://discord.gg/seriousserver', '_blank')}
          >
            <FaDiscord className="h-12 w-12 mb-3 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-lg font-semibold text-foreground">Discord</span>
            <span className="text-sm text-muted-foreground mt-2">Join Community</span>
          </Button>

        </div>
          </CardContent> 
        </Card> 
      </div> 
    </div> 
  </div> 
</div>
 

); }; 
 
 export default Contact;