"use client";

import { useState } from "react";
import { FileText, User, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth";
import { Discord, Google } from "@/components/icons";

interface ExtractorHeaderProps {
  userCredits?: number;
  maxCredits?: number;
}

const ExtractorHeader = ({ userCredits = 0, maxCredits = 10 }: ExtractorHeaderProps) => {
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useState(false);
  const { data: session } = authClient.useSession();

  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: process.env.NEXT_PUBLIC_APP_URL + "/extractor",
      });
      setIsSignInDialogOpen(false);
    } catch (error) {
      console.error("Google sign in error:", error);
    }
  };

  const handleDiscordSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "discord",
        callbackURL: process.env.NEXT_PUBLIC_APP_URL + "/extractor",
      });
      setIsSignInDialogOpen(false);
    } catch (error) {
      console.error("Discord sign in error:", error);
    }
  };

  const creditsPercentage = (userCredits / maxCredits) * 100;

  return (
    <div className="flex items-center justify-between w-full mb-8">
      {/* Left side - Title */}
      <div className="flex items-center gap-2">
        <FileText className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Data Extractor</h1>
          <p className="text-muted-foreground">Upload your files and configure extraction fields</p>
        </div>
      </div>

      {/* Right side - Auth */}
      <div>
        {session?.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 cursor-pointer">
                  <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 p-4" align="end">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
                    <AvatarFallback>
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{session.user.name || "User"}</p>
                    <p className="text-sm text-muted-foreground">{session.user.email}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Credits</span>
                    <span className="text-sm text-muted-foreground">
                      {userCredits}/{maxCredits}
                    </span>
                  </div>
                  <Progress value={creditsPercentage} className="h-2" />
                  <p className="text-xs text-muted-foreground">{userCredits} extraction credits remaining</p>
                </div>

                <Button variant="outline" className="w-full" onClick={() => authClient.signOut()}>
                  Sign Out
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Dialog open={isSignInDialogOpen} onOpenChange={setIsSignInDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Sign In to Data Extractor</DialogTitle>
                <DialogDescription>Choose your preferred sign-in method to continue</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Button onClick={handleGoogleSignIn} variant="outline" className="w-full flex items-center gap-3 h-12">
                  <Google />
                  Continue with Google
                </Button>

                <Button onClick={handleDiscordSignIn} variant="outline" className="w-full flex items-center gap-3 h-12">
                  <Discord />
                  Continue with Discord
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default ExtractorHeader;
