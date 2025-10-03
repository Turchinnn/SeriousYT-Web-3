import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { User, Session } from "@supabase/supabase-js";
import { Camera, Upload } from "lucide-react";
import authBackground from "@/assets/auth-background.jpg";
import defaultAvatar from "@/assets/default-avatar.png";

const authSchema = z.object({
  email: z.string().trim().email({ message: "Neispravna email adresa" }),
  password: z.string().min(6, { message: "Lozinka mora imati najmanje 6 karaktera" })
});

const signupSchema = z.object({
  email: z.string().trim().email({ message: "Neispravna email adresa" }),
  password: z.string().min(6, { message: "Lozinka mora imati najmanje 6 karaktera" }),
  username: z.string().trim().min(3, { message: "Korisničko ime mora imati najmanje 3 karaktera" }),
  phone: z.string().optional(),
  bio: z.string().optional(),
  dateOfBirth: z.string().optional()
});

const Auth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(defaultAvatar);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Redirect authenticated users to home
        if (session?.user) {
          navigate("/");
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validatedData = authSchema.parse({ email, password });
      
      const { error } = await supabase.auth.signInWithPassword({
        email: validatedData.email,
        password: validatedData.password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "Error",
            description: "Invalid login credentials",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Success",
          description: "You have successfully logged in!",
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Error",
          description: error.issues[0].message,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const uploadProfileImage = async (userId: string, file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/avatar.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return null;
      }

      const { data } = supabase.storage
        .from('profiles')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validatedData = signupSchema.parse({ 
        email, 
        password, 
        username, 
      });
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            username: validatedData.username
          }
        }
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          toast({
            title: "Error",
            description: "Account with same email adress already exist!",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error", 
            description: error.message,
            variant: "destructive",
          });
        }
      } else if (data.user) {
        // Upload profile image if provided
        let avatarUrl = null;
        if (profileImage) {
          avatarUrl = await uploadProfileImage(data.user.id, profileImage);
        }

        // Update profile with additional data
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            username: validatedData.username,
            phone: validatedData.phone || null,
            bio: validatedData.bio || null,
            date_of_birth: validatedData.dateOfBirth || null,
            avatar_url: avatarUrl
          })
          .eq('user_id', data.user.id);

        if (profileError) {
          console.error('Profile update error:', profileError);
        }

        toast({
          title: "Success",
          description: "Please check your email to verify your login details.",
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Error",
          description: error.issues[0].message,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-16 relative"
      style={{
        backgroundImage: `url(${authBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
         >
     <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transform-all duration 5000 animate-pulse"></div>
     <div className="w-full max-w-lg space-y-8 relative z-10">
       <div className="text-center">
         <div className="flex justify-center mb-6">
           <div className="w-[108px] h-[108px] bg-gradient-primary rounded-full flex items-center justify-center shadow-lg tranfsorm-all duration 100 pulse-glow">
             <img 
               src="/src/assets/mojlogo.png" 
               alt="Serious Logo" 
               className="w-[100px] h-[100px] object-contain rounded-full"
             />
           </div>
         </div>
        <Card className="bg-card/50 backdrop-blur-md border-border/50 shadow-xl hover-lift">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
            <CardDescription>
              Log in to an existing, or create new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="transition-all duration-300">
                  Log in
                </TabsTrigger>
                <TabsTrigger value="signup" className="transition-all duration-300">
                  Register
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="example@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="transition-all duration-300 focus:scale-[1.02]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="transition-all duration-300 focus:scale-[1.02]"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full transition-all duration-500 hover:scale-105 hover-lift glow-on-hover" 
                    disabled={loading}
                  >
                    {loading ? "Loging in..." : "Log in"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  {/* Profile Picture Upload */}
                  <div className="space-y-2">
                    <Label>Profile Picture</Label>
                    <div className="flex flex-col items-center space-y-3">
                      <div className="relative">
                        <img
                          src={previewUrl}
                          alt="Profile preview"
                          className="w-20 h-20 rounded-full object-cover border-4 border-primary/20"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <p className="text-xs text-muted-foreground text-center">
                        Click here to add your profile picture
                      </p>
                    </div>
                  </div>
{/* 
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-fullname">Ime i prezime</Label>
                      <Input
                        id="signup-fullname"
                        type="text"
                        placeholder="Marko Marković"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="transition-all duration-300 focus:scale-[1.02]"
                      /> */}

                    <div className="space-y-2">
                      <Label htmlFor="signup-username">Korisničko ime</Label>
                      <Input
                        id="signup-username"
                        type="text"
                        placeholder="dominik dosen"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="transition-all duration-300 focus:scale-[1.02]"
                      />
                    </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="transition-all duration-300 focus:scale-[1.02]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Lozinka</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="transition-all duration-300 focus:scale-[1.02]"
                    />
                  </div>
{/* 
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-phone">Telefon (opciono)</Label>
                      <Input
                        id="signup-phone"
                        type="tel"
                        placeholder="+381 60 123 4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="transition-all duration-300 focus:scale-[1.02]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-dob">Datum rođenja (opciono)</Label>
                      <Input
                        id="signup-dob"
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className="transition-all duration-300 focus:scale-[1.02]"
                      />
                    </div>
                  </div> */}
{/* 
                  <div className="space-y-2">
                    <Label htmlFor="signup-bio">O meni (opciono)</Label>
                    <Textarea
                      id="signup-bio"
                      placeholder="Kratko opišite sebe..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="min-h-[80px] transition-all duration-300 focus:scale-[1.02]"
                    />
                  </div> */}

                  <Button 
                    type="submit" 
                    className="w-full transition-all duration-500 hover:scale-105 hover-lift glow-on-hover" 
                    disabled={loading}
                  >
                    {loading ? "Registracija..." : "Registruj se"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
      </div>
  );
};

export default Auth;