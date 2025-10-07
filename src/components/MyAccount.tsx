import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { User as UserIcon, LogOut, Camera, Save, Package } from "lucide-react";
import MyOrders from "./MyOrders";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "@/assets/default-avatar.png";
import ImageCropper from "./ImageCropper";

interface Profile {
  id: string;
//  user_id: string;
  full_name: string | null;
  username: string | null;
 // bio: string | null;
  avatar_url: string | null;
  phone: string | null;
 // date_of_birth: string | null;
}

interface MyAccountProps {
  user: User;
  session: Session;
  onLogout: () => void;
}

const MyAccount = ({ user, session, onLogout }: MyAccountProps) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isOrdersDialogOpen, setIsOrdersDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    bio: "",
    phone: "",
    date_of_birth: "",
  });

  useEffect(() => {
    fetchProfile();
  }, [user.id]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        setProfile(data);
        setFormData({
          full_name: data.full_name || "",
          username: data.username || "",
          bio: data.bio || "",
          phone: data.phone || "",
          date_of_birth: data.date_of_birth || "",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "It's not possible to load profile.",
        variant: "destructive",
      });
    }
  };

  const updateProfile = async () => {
    setIsLoading(true);
    try {
      const updateData = {
        user_id: user.id,
        ...formData,
        updated_at: new Date().toISOString(),
      };

      if (profile?.id) {
        (updateData as any).id = profile.id;
      }

      const { error } = await supabase.from("profiles").upsert(updateData);

      if (error) throw error;

      await fetchProfile();
      setIsEditDialogOpen(false);
      toast({
        title: "Success",
        description: "Your Profile is successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("profiles")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("profiles")
        .getPublicUrl(filePath);

      const updateData = {
        user_id: user.id,
        avatar_url: publicUrl,
        updated_at: new Date().toISOString(),
      };

      if (profile?.id) {
        (updateData as any).id = profile.id;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .upsert(updateData);

      if (updateError) throw updateError;

      await fetchProfile();
      toast({
        title: "Success",
        description: "Profilna slika je uspešno ažurirana",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setIsCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    const file = new File([croppedImageBlob], "avatar.jpg", { type: "image/jpeg" });
    await uploadAvatar(file);
    setIsCropperOpen(false);
    setSelectedImage("");
  };

  const handleCropCancel = () => {
    setIsCropperOpen(false);
    setSelectedImage("");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
    navigate("/");
    toast({
      title: "You've Logged out.",
      description: "You Successfully logged out of your profile.",
    });
  };

  return (
    <Card className="w-80 bg-background/95 backdrop-blur-md border-border/50 shadow-lg">
      <CardHeader className="text-center pb-4">
        <div className="relative mx-auto mb-4">
          <Avatar className="w-20 h-20 border-4 border-primary/20">
            <AvatarImage src={profile?.avatar_url || defaultAvatar} alt="Profile picture" />
            <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xl">
              {profile?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <label className="absolute -bottom-1 -right-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-2 cursor-pointer transition-all duration-300 hover:scale-110 magnetic">
            <Camera className="w-4 h-4" />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
        <CardTitle className="text-foreground">
          {profile?.full_name || profile?.username || "Korisnik"}
        </CardTitle>
        <CardDescription className="text-muted-foreground">{user.email}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Edit Profile Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full border-primary/50 text-primary hover:bg-primary/20 transition-all duration-300 hover:scale-105 magnetic"
            >
              <UserIcon className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-md border-border/50">
            <DialogHeader>
              <DialogTitle className="text-foreground">Edit Profile</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Update information about your profile
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full name</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Your Full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Your Username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telephone number (optional)</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+385 95 1234 567"
                />
              </div>

              <Button
                onClick={updateProfile}
                disabled={isLoading}
                className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-300 hover:scale-105 magnetic"
              >
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* My Orders Dialog */}
        <Dialog open={isOrdersDialogOpen} onOpenChange={setIsOrdersDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full border-primary/50 text-primary hover:bg-primary/20 transition-all duration-300 hover:scale-105 magnetic"
            >
              <Package className="mr-2 h-4 w-4" />
              My Orders
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-background/95 backdrop-blur-md border-border/50">
            <DialogHeader>
              <DialogTitle className="text-foreground">My Orders</DialogTitle>
            </DialogHeader>
            <MyOrders user={user} />
          </DialogContent>
        </Dialog>

        {/* Logout */}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full border-destructive/50 text-destructive hover:bg-destructive/20 transition-all duration-300 hover:scale-105 magnetic"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>

        {isCropperOpen && (
          <ImageCropper
            src={selectedImage}
            onCropComplete={handleCropComplete}
            onCancel={handleCropCancel}
            isOpen={isCropperOpen}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default MyAccount;
