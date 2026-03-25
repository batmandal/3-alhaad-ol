"use client";

import Link from "next/link";
import { useAppStore } from "@/lib/store/app-store";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoginForm } from "@/components/auth/login-form";
import { SignupForm } from "@/components/auth/signup-form";
import {
  authDialogContentClassName,
  authDialogTitleClassName,
} from "@/components/auth/auth-classes";
import * as React from "react";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const { currentUser, logout } = useAppStore();
  const [authOpen, setAuthOpen] = React.useState(false);
  const [authMode, setAuthMode] = React.useState<"login" | "signup">("login");

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl transition-colors duration-500">
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between gap-4 px-4 sm:h-[4.5rem] sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-3 font-bold tracking-tight text-foreground transition-all duration-300 hover:opacity-90 active:scale-[0.98]"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 via-rose-400 to-teal-400 text-lg font-extrabold text-white shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-active:scale-95 sm:size-11">
            N
          </span>
          <span className="hidden bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-lg text-transparent sm:inline">
            3 Алхаад ол
          </span>
        </Link>
        <nav className="flex items-center gap-2">
          {currentUser?.isAdmin && (
            <Link
              href="/admin"
              className={cn(
                buttonVariants({ variant: "ghost", size: "default" }),
                "transition-all duration-300 hover:bg-rose-50 hover:text-rose-600 active:scale-95 dark:hover:bg-rose-950/30",
              )}
            >
              Админ
            </Link>
          )}
          {currentUser ? (
            <>
              <Link
                href="/profile"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "default" }),
                  "font-medium transition-all duration-300 hover:bg-teal-50 hover:text-teal-600 active:scale-95 dark:hover:bg-teal-950/30",
                )}
              >
                {currentUser.name}
              </Link>
              <Button
                variant="outline"
                size="default"
                onClick={logout}
                className="border-rose-200 text-rose-600 transition-all duration-300 hover:bg-rose-50 hover:text-rose-700 active:scale-95 dark:border-rose-900/50 dark:text-rose-400"
              >
                Гарах
              </Button>
            </>
          ) : (
            <Dialog
              open={authOpen}
              onOpenChange={(o) => {
                setAuthOpen(o);
              }}
            >
              <DialogTrigger
                render={
                  <Button
                    variant="outline"
                    size="default"
                    className="transition-all duration-300 hover:shadow-md active:scale-95"
                  />
                }
              >
                Нэвтрэх
              </DialogTrigger>
              <DialogContent className={authDialogContentClassName}>
                <DialogHeader className="space-y-1 text-left">
                  <DialogTitle className={authDialogTitleClassName}>
                    {authMode === "login" ? "Нэвтрэх" : "Бүртгүүлэх"}
                  </DialogTitle>
                </DialogHeader>
                {authMode === "login" ? (
                  <LoginForm
                    onSuccess={() => setAuthOpen(false)}
                    onSwitchSignup={() => setAuthMode("signup")}
                  />
                ) : (
                  <SignupForm
                    onSuccess={() => setAuthOpen(false)}
                    onSwitchLogin={() => setAuthMode("login")}
                  />
                )}
              </DialogContent>
            </Dialog>
          )}
        </nav>
      </div>
    </header>
  );
}
