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
import { Camera } from "lucide-react";
import authBackground from "@/assets/auth-background.jpg";
import defaultAvatar from "@/assets/default-avatar.png";

// Validation schemas
const authSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

const signupSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
  username: z.string().trim().min(3, { message: "Username must be at least 3 characters" }),
});

// Discord webhook function
const sendDiscordWebhook = async (message: string) => {
  try {
    await fetch("https://discord.com/api/webhooks/1426204644773990584/UYu3HFKiH9ED6ULrUFym2rfoxP7DeD5ICgNuaIS_OceWnhl6XqzngKP6VLFTYSeE8a5J", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message }),
    });
  } catch (err) {
    console.error("Error sending Discord webhook:", err);
  }
};

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
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) navigate("/");
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) navigate("/");
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
        toast({
          title: "Error",
          description: error.message.includes("Invalid login credentials")
            ? "Invalid login credentials"
            : error.message,
          variant: "destructive",
        });
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
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}/avatar.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("profiles")
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return null;
      }

      const { data } = supabase.storage.from("profiles").getPublicUrl(fileName);
      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const validatedData = signupSchema.parse({ email, password, username });
      const redirectUrl = `${window.location.origin}/`;

      const { data, error } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: { username: validatedData.username },
        },
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message.includes("User already registered")
            ? "An account with this email already exists."
            : error.message,
          variant: "destructive",
        });
      } else if (data.user) {
        // Upload profile picture
        let avatarUrl = null;
        if (profileImage) {
          avatarUrl = await uploadProfileImage(data.user.id, profileImage);
        }

        // Update user profile
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            username: validatedData.username,
            avatar_url: avatarUrl,
          })
          .eq("user_id", data.user.id);

        if (profileError) console.error("Profile update error:", profileError);

        // ✅ Send Discord notification in Croatian
        await sendDiscordWebhook(
          `👤 **Novi korisnik se registrirao!**
━━━━━━━━━━━━━━━━━━━━━━
📧 **Email:** ${validatedData.email}
🏷️ **Korisničko ime:** ${validatedData.username}
🕐 **Vrijeme:** ${new Date().toLocaleString("hr-HR")}
━━━━━━━━━━━━━━━━━━━━━━`
        );

        toast({
          title: "Success",
          description: "Please check your email to verify your account.",
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

  // Optional: function for profile edit (to trigger webhook)
  const handleProfileEdit = async (updatedData: any) => {
    if (!user) return;
    await supabase.from("profiles").update(updatedData).eq("user_id", user.id);
    await sendDiscordWebhook(
      `✏️ **Korisnik je ažurirao svoj profil!**
━━━━━━━━━━━━━━━━━━━━━━
📧 **Email:** ${user.email}
🏷️ **Promijenjeni podaci:** ${JSON.stringify(updatedData, null, 2)}
🕐 **Vrijeme:** ${new Date().toLocaleString("hr-HR")}
━━━━━━━━━━━━━━━━━━━━━━`
    );
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16 relative"
      style={{
        backgroundImage: `url(${authBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      <div className="w-full max-w-lg space-y-8 relative z-10">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-[108px] h-[108px] bg-gradient-primary rounded-full flex items-center justify-center shadow-lg">
              <img
                src="https://i.ibb.co/v4XwnWC0/mojlogo.png"
                alt="Logo"
                className="w-[100px] h-[100px] object-contain rounded-full"
              />
            </div>
          </div>

          <Card className="bg-card/50 backdrop-blur-md border-border/50 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
              <CardDescription>Log in or create a new account</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign up</TabsTrigger>
                </TabsList>

                {/* LOGIN */}
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
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Logging in..." : "Login"}
                    </Button>
                  </form>
                </TabsContent>

                {/* SIGN UP */}
                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2 text-center">
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
                        <p className="text-xs text-muted-foreground">
                          Click to add your profile picture
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-username">Username</Label>
                      <Input
                        id="signup-username"
                        type="text"
                        placeholder="john_doe"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="example@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Signing up..." : "Sign Up"}
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
