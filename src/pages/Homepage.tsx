import { Gift, Users, PhoneCall, Zap, ArrowRight, User } from 'lucide-react';
import { AnimatedSection } from '@/components/AnimatedSection';
import { ParallaxBackground } from '@/components/ParallaxBackground';
import { ScrollProgress } from '@/components/ScrollProgress';
import heroVideo from "@/assets/hero-video.mp4";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Button2 } from "@/components/ui/button2";
import { FaDownload } from "react-icons/fa";
import AnimatedBackground from "@/components/AnimatedBackground";

const EnhancedHomepage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background smooth-scroll">
      <ScrollProgress />

      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover object-center scale-105 opacity-90 transition-all duration-700 hover:opacity-90 blur-lg"
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
        ></video>
        <div className="absolute inset-0 bg-black/45 backdrop-blur-sm"></div>

          <div className="absolute inset-0 bg-gradient-glow opacity-[100%] pulse-glow"></div>

        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/0 to-background/100"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection animation="fade-in" delay={0}>
              <div className="relative inline-block mb-8">
                {/* 🔵 Blue pulse glow circle */}
                <div className="absolute inset-0 flex items-center mt-36 justify-center -z-10">
                  <div className="w-96 h-96 md:w-96 md:h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
                </div>

                <h1 className="text-6xl md:text-8xl font-bold bg-accent bg-clip-text text-transparent floating relative z-10">
                  Welcome to Serious
                </h1>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={200}>
              <p className="text-2xl md:text-3xl text-foreground/90 mb-2 font-medium">
                Welcome to official website of YouTube streamer Serious.
              </p>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={400}>
              <p className="text-2xl md:text-3xl text-foreground/90 mb-20 font-medium">
                Scroll to see navigation bar.
              </p>
            </AnimatedSection>

            <AnimatedSection animation="scale-up" delay={600}>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button2 variant='glass-accent'
                  className="border-2 border-primary text-white hover:bg-primary/20 transition-all duration-500 hover:scale-110 hover:shadow-2x1 px-8 py-6 text-lg rounded-lg backdrop-blur-sm hover-lift glow-on-hover flex items-center justify-center font-semibold"
                  onClick={() => navigate('/contact')}
                >
                  <PhoneCall className="mr-2 h-6 w-6" />
                  Contact
                </Button2>
                <Button2 variant='glass-accent'
                  className="border-2 border-primary text-white hover:bg-primary/20 transition-all duration-500 hover:scale-110 hover:shadow-2x1 px-8 py-6 text-lg rounded-lg backdrop-blur-sm hover-lift glow-on-hover flex items-center justify-center font-semibold"
                  onClick={() => navigate('/social')}
                >
                  <Users className="mr-2 h-6 w-6" />
                  Join Community
                </Button2>
              </div>
            </AnimatedSection>
          </div>
        </div>

        {/* HERO SECTION završetak */}
        <AnimatedBackground /> {/* ✅ Dodano — tvoj animirani background ide ispod svega */}

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce floating z-20">
          <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center pulse-glow">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
        </section>


{/* ABOUT SECTION */}
<section id="about" className="py-20 relative overflow-hidden">
  {/* ✅ Tvoj animirani background ubacen ovdje */}
  <AnimatedBackground />

  <div className="absolute inset-0 bg-gradient-primary opacity-[0%]"></div>

  <div className="container mx-auto px-6 relative z-10">
    <div className="max-w-4xl mx-auto">
      <AnimatedSection animation="fade-up" threshold={0.2}>
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-3 text-foreground transition-all duration-500 hover:scale-110">
            About Serious
          </h2>
          <p className="text-xl text-muted-foreground mb-8 transition-all duration-500 hover:scale-110">
            Streamer & Content Creator
          </p>
        </div>
      </AnimatedSection>

      <AnimatedSection animation="zoom-in" delay={200} threshold={0.2}>
        <div className="bg-surface-dark/0 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-700 glow-on-hover hover-lift rounded-lg p-12 relative overflow-hidden">
          <div className="absolute inset-0 transform -skew-y-0 bg-gradient-to-b from-primary/30 via-primary/10 to-transparent"></div>

          <div className="relative z-10 text-center">
            <p className="text-lg text-foreground leading-relaxed mb-6">
              Hrvatski
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Serious je uspješni YouTube kanal. Emitira zanimljive live-ove,
              uglavnom zabavne prirode. Svojim sadržajem privukao je brojne ljude i stekao nekolicinu
              uspješnih suradnji. Kanal je aktivan i redovno postavlja nove materijale kako bi
              zadržao interes gledatelja...
            </p>

            <p className="text-lg leading-relaxed mt-16 mb-6">English</p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Serious is a successful YouTube channel. It streams engaging live shows, mostly of an entertaining nature.
              With its content, it has attracted a large audience and established several successful collaborations.
              The channel is active and regularly uploads new material to maintain viewers' interest.
            </p>
          </div>

          <div className="text-center mt-20">
            <Button2 variant='glass-accent'
              size="lg"
              className="border-2 border-primary bg-gradient-primary hover:opacity-90 transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-primary/40 px-8 py-4 text-lg magnetic glow-on-hover transform-gpu"
              onClick={() => navigate('/contact')}
            >
              <ArrowRight className="mr-2 h-6 w-6" />
              Show more
            </Button2>
          </div>
        </div>
      </AnimatedSection>
    </div>
  </div>
</section>


      {/* ENHANCED FEATURES SECTION */}
      <section className="py-20 bg-surface-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow opacity-15 pulse-glow"></div>
        <div className="absolute inset-0 shimmer opacity-10"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center animate-fade-in hover-lift transition-all duration-700 group stagger-animation" style={{ animationDelay: '2s' }}>
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-2xl group-hover:shadow-primary/50 transition-all duration-700 pulse-glow floating magnetic">
                <Gift className="h-10 w-10 text-primary-foreground group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground group-hover:text-primary transition-colors duration-300">
                Verified Giveaways
              </h3>
              <p className="text-muted-foreground text-lg group-hover:text-muted-foreground/90 transition-colors duration-300">
                All giveaways that Serious made are verified and legit.
              </p>
            </div>

            <div className="text-center animate-fade-in hover-lift transition-all duration-700 group stagger-animation" style={{ animationDelay: '0.2s' }}>
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-2xl group-hover:shadow-primary/50 transition-all duration-700 pulse-glow floating magnetic">
                <Users className="h-10 w-10 text-primary-foreground group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground group-hover:text-primary transition-colors duration-300">
                Active Community
              </h3>
              <p className="text-muted-foreground text-lg group-hover:text-muted-foreground/90 transition-colors duration-300">
                Join thousands of members in our growing community.
              </p>
            </div>

            <div className="text-center animate-fade-in hover-lift transition-all duration-700 group stagger-animation" style={{ animationDelay: '0.4s' }}>
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-2xl group-hover:shadow-primary/50 transition-all duration-700 pulse-glow floating magnetic">
                <FaDownload className="h-10 w-10 text-primary-foreground group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground group-hover:text-primary transition-colors duration-300">
                Current Updates
              </h3>
              <p className="text-muted-foreground text-lg group-hover:text-muted-foreground/90 transition-colors duration-300">
                We're deploying our verified app very soon, make sure to download it first!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EnhancedHomepage;
