"use client";

import { useState } from "react";
import { FileText, User, LogIn, CreditCard } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { authClient, signOut, useSession } from "@/lib/auth";
import { Discord, Google } from "@/components/icons";

const ExtractorHeader = () => {
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useState(false);
  const { data: session } = useSession();

  const userCredits = session?.user?.credits || 0;
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

  return (
    <div className="flex items-center justify-between w-full mb-8">
      <div className="flex items-center gap-2">
        <FileText className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Data Extractor</h1>
          <p className="text-muted-foreground">Upload your files and configure extraction fields</p>
        </div>
      </div>

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

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Credits</span>
                    </div>
                    <Badge variant="secondary" className="bg-primary/10 text-primary font-semibold">
                      {userCredits}
                    </Badge>
                  </div>
                  <div className="bg-muted/50 rounded-md p-3">
                    <p className="text-xs text-muted-foreground text-center">
                      You have <span className="font-medium text-foreground">{userCredits}</span> extraction credits
                      remaining
                    </p>
                  </div>
                </div>

                <Button variant="outline" className="w-full" onClick={() => signOut()}>
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
