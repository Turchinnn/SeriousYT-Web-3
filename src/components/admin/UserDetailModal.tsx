import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Mail, Calendar, User, Hash } from "lucide-react";

interface UserDetailModalProps {
  user: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailModal({ user, open, onOpenChange }: UserDetailModalProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-br from-slate-900/95 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-black text-transparent bg-gradient-to-r from-white to-slate-300 bg-clip-text">
            User Details
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/30">
                <div className="flex items-center gap-2 mb-2">
                  <Hash className="h-4 w-4 text-admin-primary" />
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                    User ID
                  </span>
                </div>
                <div className="text-white font-mono text-sm break-all">{user.id}</div>
              </div>

              <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/30">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4 text-admin-secondary" />
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                    Email
                  </span>
                </div>
                <div className="text-white font-semibold">{user.email || "N/A"}</div>
              </div>

              <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/30">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-admin-success" />
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                    Name
                  </span>
                </div>
                <div className="text-white font-semibold">
                  {user.first_name || user.last_name
                    ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
                    : "N/A"}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/30">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-admin-warning" />
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                    Created At
                  </span>
                </div>
                <div className="text-white font-semibold">
                  {new Date(user.created_at).toLocaleString()}
                </div>
              </div>

              <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/30">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-admin-warning" />
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                    Last Updated
                  </span>
                </div>
                <div className="text-white font-semibold">
                  {user.updated_at
                    ? new Date(user.updated_at).toLocaleString()
                    : "N/A"}
                </div>
              </div>

              <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/30">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                    Status
                  </span>
                </div>
                <Badge className="bg-admin-success/20 text-admin-success border-admin-success/40">
                  Active
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
