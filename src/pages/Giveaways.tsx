import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Clock, Users, Trophy, Filter } from "lucide-react";
import { allGiveaways, getActiveGiveaways, getEndedGiveaways } from "@/data/giveaways";




const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return "bg-green-500/20 text-green-400 border-green-500/50";
    case "ending-soon": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
    case "ended": return "bg-red-500/20 text-red-400 border-red-500/50";
    default: return "bg-muted text-muted-foreground";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "active": return "Active";
    case "ending-soon": return "Ending Soon";
    case "ended": return "Ended";
    default: return "Unknown";
  }
};

const getDaysRemaining = (endDate: string) => {
  const end = new Date(endDate);
  const now = new Date();
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

const Giveaways = () => {
  const activeGiveaways = getActiveGiveaways();
  const endedGiveaways = getEndedGiveaways();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pt-20">
      <div className="container mx-auto px-6 py-16"></div>

      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-background to-blue-700/20 animate-gradient-shift"></div>
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-background/90"></div>
      
      <div className="container mx-auto pb-20 px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-7 bg-gradient-primary bg-clip-text text-transparent animate-slide-up">
            All Giveaways
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-slide-up">
            Participate in our exclusive giveaways for a chance to win incredible prizes. All giveaways are verified and legitimate.
          </p>
        </div>

        {/* Stats Section */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
  <Card className="bg-surface-dark border-border text-center hover:border-primary/50 transition-all duration-700 hover:shadow-2xl hover:shadow-primary/20 hover-lift animate-fade-in glow-on-hover" style={{ animationDelay: '0s' } as React.CSSProperties}>
    <CardContent className="pt-6">
      <Trophy className="h-8 w-8 text-primary mx-auto mb-2 transition-all duration-500 hover:scale-125 hover:rotate-12" />
      <div className="text-2xl font-bold text-foreground">{allGiveaways.length}</div>
      <div className="text-sm text-muted-foreground">Total Giveaways</div>
    </CardContent>
  </Card>

  <Card className="bg-surface-dark border-border text-center hover:border-primary/50 transition-all duration-700 hover:shadow-2xl hover:shadow-primary/20 hover-lift animate-fade-in glow-on-hover" style={{ animationDelay: '0.1s' } as React.CSSProperties}>
    <CardContent className="pt-6">
      <Clock className="h-8 w-8 text-green-400 mx-auto mb-2 transition-all duration-500 hover:scale-125 hover:rotate-12" />
      <div className="text-2xl font-bold text-foreground">{activeGiveaways.length}</div>
      <div className="text-sm text-muted-foreground"></div>
      <div className="text-sm text-muted-foreground">Giveaways Active Now</div>
    </CardContent>
  </Card>

  <Card className="bg-surface-dark border-border text-center hover:border-primary/50 transition-all duration-700 hover:shadow-2xl hover:shadow-primary/20 hover-lift animate-fade-in glow-on-hover" style={{ animationDelay: '0.2s' } as React.CSSProperties}>
    <CardContent className="pt-6">
      <Users className="h-8 w-8 text-primary mx-auto mb-2 transition-all duration-500 hover:scale-125 hover:rotate-12" />
      <div className="text-2xl font-bold text-foreground">
        {allGiveaways.reduce((sum, g) => sum + g.participants, 0).toLocaleString()}
      </div>
      <div className="text-sm text-muted-foreground">Total Participants</div>
    </CardContent>
  </Card>

  <Card className="bg-surface-dark border-border text-center hover:border-primary/50 transition-all duration-700 hover:shadow-2xl hover:shadow-primary/20 hover-lift animate-fade-in glow-on-hover" style={{ animationDelay: '0.3s' } as React.CSSProperties}>
    <CardContent className="pt-6">
      <Filter className="h-8 w-8 text-primary mx-auto mb-2 transition-all duration-500 hover:scale-125 hover:rotate-12" />
      <div className="text-2xl font-bold text-foreground">
        ${allGiveaways.reduce((sum, g) => sum + parseInt(g.value.replace('$', '').replace(',', '')), 0).toLocaleString()}
      </div>
      <div className="text-sm text-muted-foreground">Total Prize Value</div>
    </CardContent>
  </Card>
</div>


        {/* Active Giveaways */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-foreground flex items-center gap-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            Active Giveaways
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeGiveaways.map((giveaway, index) => (
              <Card 
                key={giveaway.id} 
                className="bg-surface-dark border-border hover:border-primary/70 transition-all duration-700 group hover:shadow-2xl hover:shadow-primary/40 hover-lift animate-fade-in glow-on-hover transform-gpu"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <CardHeader>
                  <div className="w-full h-48 bg-muted rounded-lg mb-4 overflow-hidden relative group/image">
                    <img 
                      src={giveaway.image} 
                      alt={giveaway.title}
                      className="w-full h-full object-cover group-hover/image:scale-125 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-glow opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                    <div className="absolute top-3 left-3">
                      <Badge className={getStatusColor(giveaway.status)}>
                        {getStatusText(giveaway.status)}
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge variant="outline" className="bg-background/80 border-primary text-primary">
                        {giveaway.value}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-foreground group-hover:text-primary transition-colors duration-300">{giveaway.title}</CardTitle>
                  <CardDescription className="text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-300">
                    {giveaway.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm transition-all duration-300 group-hover:scale-105">
                      <span className="text-muted-foreground">Participants:</span>
                      <span className="text-primary font-semibold pulse-glow">{giveaway.participants.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm transition-all duration-300 group-hover:scale-105">
                      <span className="text-muted-foreground">Expires in:</span>
                      <span className="text-foreground font-semibold">{getDaysRemaining(giveaway.endDate)} days</span>
                    </div>
                    <Button 
                      className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-primary/40 magnetic glow-on-hover transform-gpu"
                      onClick={() => window.open(giveaway.url, '_blank')}
                    >
                      <ExternalLink className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                      Participate | Učestvuj
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Past Giveaways */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-foreground flex items-center gap-3">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            Prošli Giveaway-jevi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {endedGiveaways.map((giveaway, index) => (
              <Card 
                key={giveaway.id} 
                className="bg-surface-dark border-border opacity-75 hover:opacity-100 transition-all duration-700 hover:shadow-lg hover-lift animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="w-full h-48 bg-muted rounded-lg mb-4 overflow-hidden relative group/image">
                    <img 
                      src={giveaway.image} 
                      alt={giveaway.title}
                      className="w-full h-full object-cover grayscale group-hover/image:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className={getStatusColor(giveaway.status)}>
                        {getStatusText(giveaway.status)}
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge variant="outline" className="bg-background/80 border-muted text-muted-foreground">
                        {giveaway.value}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-foreground">{giveaway.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {giveaway.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Final Participants:</span>
                      <span className="text-muted-foreground">{giveaway.participants.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Ended:</span>
                      <span className="text-muted-foreground">{new Date(giveaway.endDate).toLocaleDateString()}</span>
                    </div>
                    <Button disabled className="w-full" variant="outline">
                      Giveaway Ended | Završen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Giveaways;