import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Users, Zap, ArrowRight, PhoneCall, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaCloudDownloadAlt, FaDownload, FaSubscript } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";

// umjesto slike importaj video
import heroVideo from "@/assets/hero-video.mp4";

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background smooth-scroll">
      {/* Full-Screen Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-20 transition-all duration-700 hover:opacity-25"
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
        ></video>

        {/* Black Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-glow opacity-[100%] pulse-glow"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/0 to-background/100"></div>
        
        {/* Content */}
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-primary bg-clip-text text-transparent animate-fade-in floating">
              Welcome to Serious
            </h1>
            <p className="text-2xl md:text-3xl text-foreground/90 mb-2 animate-slide-up font-medium text-reveal duration-500 hover:scale-110">
              Welcome to official website of YouTube streamer Serious.
            </p>
             <p className="text-2xl md:text-3xl text-foreground/90 mb-12 animate-slide-up font-medium text-reveal duration-500 hover:scale-110">
              Scroll to see navigation bar.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-scale-in">
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:opacity-90 transition-all duration-500 animate-slide-up hover:scale-110 hover:shadow-2x1 hover:shadow-primary/40 px-8 py-4 text-lg magnetic glow-on-hover transform-gpu"
                onClick={() => navigate('/contact')}
              >
                <PhoneCall className="mr-2 h-6 w-6" />
                Contact
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-primary text-primary hover:bg-primary/20 transition-all duration-500  animate-slide-up  hover:scale-110 hover:shadow-2xl hover:shadow-primary/30 px-8 py-4 text-lg backdrop-blur-sm hover-lift glow-on-hover"
                onClick={() => navigate('/social')}
              >
                <Users className="mr-2 h-6 w-6" />
                Join Community
              </Button>
            </div>
          </div>
        </div>
        
        {/* Enhanced Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce floating">
          <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center pulse-glow">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>



      {/* About Serious Section */}
      <section id="about" className="py-20 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-[0%]"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold mb-3 text-foreground animate-slide-up transition-all duration-500 hover:scale-110">
                About Serious
              </h2>
              <p className="text-xl text-muted-foreground mb-8 animate-slide-up transition-all duration-500 hover:scale-110">
                Streamer & Content Creator
              </p>
            </div>

            <Card className="bg-surface-glow/0 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-700 animate-fade-in glow-on-hover hover-lift">
              <CardContent className="p-12 relative overflow-hidden">
                {/* Left angled background rectangle with opacity fade */}
                <div className="absolute inset-0 transform -skew-z-12 translate-b-[-50%] bg-gradient-to-b from-primary/30 via-primary/[10%] to-transparent"></div>
                {/* Right angled background rectangle with opacity fade */}
                <div className="absolute inset-0 transform skew-z-12 translate-b-[-50%] bg-gradient-to-b from-electric-blue-glow/10 via-electric-blue-glow/5 to-transparent"></div>
                
                <div className="relative z-10 text-center">
                  <p className="text-lg text-foreground leading-relaxed mb-6 transition-all duration-500 hover:scale-150">
                    Hrvatski
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6 transition-all duration-500 hover:scale-110">
                    Serious je uspješni YouTube kanal. Emitira zanimljive live-ove,
                    uglavnom zabavne prirode. Svojim sadržajem privukao je brojne ljude i stekao nekolicinu
                    uspješnih suradnji. Kanal je aktivan i redovno postavlja nove materijale kako bi
                    zadržao interes gledatelja...
                  </p>


                  
                  <p className="text-lg leading-relaxed mt-16 mb-6 transition-all duration-500 hover:scale-150">
                    English
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed transition-all duration-500 hover:scale-110">
                  Serious is a successful YouTube channel. It streams engaging live shows, mostly of an entertaining nature. 
                  With its content, it has attracted a large audience and established several successful collaborations. 
                  The channel is active and regularly uploads new material to maintain viewers’ interest.
                  </p>
                </div>
                
                <div className="text-center mt-20">
                  <Button 
                    size="lg" 
                    className="bg-gradient-primary hover:opacity-90 transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-primary/40 px-8 py-4 text-lg magnetic glow-on-hover transform-gpu"
                    onClick={() => navigate('/contact')}
                  >
                    <ArrowRight className="mr-2 h-6 w-6" />
                    Show more
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20 bg-surface-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow opacity-15 pulse-glow"></div>
        <div className="absolute inset-0 shimmer opacity-5"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center animate-fade-in hover-lift transition-all duration-700 group stagger-animation" style={{ animationDelay: '0s' } as React.CSSProperties}>
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-2xl group-hover:shadow-primary/50 transition-all duration-700 pulse-glow floating magnetic">
                <Gift className="h-10 w-10 text-primary-foreground group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground group-hover:text-primary transition-colors duration-300">Verified Giveaways</h3>
              <p className="text-muted-foreground text-lg group-hover:text-muted-foreground/90 transition-colors duration-300">All giveaways that Serious made, are verified and legit.</p>
            </div>
            <div className="text-center animate-fade-in hover-lift transition-all duration-700 group stagger-animation" style={{ animationDelay: '0.2s' } as React.CSSProperties}>
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-2xl group-hover:shadow-primary/50 transition-all duration-700 pulse-glow floating magnetic">
                <Users className="h-10 w-10 text-primary-foreground group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground group-hover:text-primary transition-colors duration-300">Active Community</h3>
              <p className="text-muted-foreground text-lg group-hover:text-muted-foreground/90 transition-colors duration-300">Join thousands of members in our growing community.</p>
            </div>
            <div className="text-center animate-fade-in hover-lift transition-all duration-700 group stagger-animation" style={{ animationDelay: '0.4s' } as React.CSSProperties}>
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-2xl group-hover:shadow-primary/50 transition-all duration-700 pulse-glow floating magnetic">
                <FaDownload className="h-10 w-10 text-primary-foreground group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground group-hover:text-primary transition-colors duration-300">Current updates</h3>
              <p className="text-muted-foreground text-lg group-hover:text-muted-foreground/90 transition-colors duration-300">We're deploying our verified app very soon!</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
