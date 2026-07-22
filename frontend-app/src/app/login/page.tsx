"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Cpu,
  Lock,
  Mail,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (res?.error) {
        const message = "Invalid email or password";
        setError(message);
        toast.error(message);
      } else {
        router.push(callbackUrl);
      }
    } catch {
      const message = "Something went wrong. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg-light dark:bg-brand-bg-dark px-4 font-sans selection:bg-brand-emerald/30 text-brand-teal dark:text-white transition-colors duration-300">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.5)_0%,transparent_100%)] dark:bg-[radial-gradient(circle_at_center,rgba(10,176,139,0.06)_0%,transparent_100%)]" />

      <Card className="relative z-10 w-full max-w-[420px] overflow-hidden rounded-[32px] border border-black/5 dark:border-white/5 bg-white/80 dark:bg-brand-card-dark shadow-xl dark:shadow-2xl backdrop-blur-md">
        <div className="absolute inset-x-0 -top-[1px] mx-auto h-[1px] w-1/2 bg-gradient-to-r from-transparent via-brand-emerald/50 to-transparent" />

        <CardHeader className="flex flex-col items-center pb-6 pt-10 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-emerald to-[#089172] shadow-[0_4px_10px_rgba(10,176,139,0.2)] dark:shadow-[0_0_20px_rgba(10,176,139,0.4)]">
            <Cpu className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-teal dark:text-zinc-100">
            Welcome Back
          </h1>
          <p className="mt-1.5 text-sm text-brand-teal-light dark:text-zinc-400">
            Enter your credentials to access FinMind
          </p>
        </CardHeader>

        <Separator className="border-t border-black/5 dark:border-white/5 bg-transparent" />

        <CardContent className="px-8 pb-6 pt-8">
          <form className="space-y-4" onSubmit={handleCredentialsSignIn}>
            <div className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-zinc-500" />
                <Input
                  id="email"
                  placeholder="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  className="h-12 rounded-xl border-black/5 dark:border-white/5 bg-slate-100 dark:bg-brand-teal/20 pl-10 text-sm text-brand-teal dark:text-zinc-100 transition-colors focus-visible:border-brand-emerald/50 focus-visible:ring-brand-emerald/20 placeholder:text-zinc-500 dark:placeholder:text-zinc-600"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-zinc-500" />
                <Input
                  id="password"
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  autoComplete="current-password"
                  className="h-12 rounded-xl border-black/5 dark:border-white/5 bg-slate-100 dark:bg-brand-teal/20 pl-10 text-sm text-brand-teal dark:text-zinc-100 transition-colors focus-visible:border-brand-emerald/50 focus-visible:ring-brand-emerald/20 placeholder:text-zinc-500 dark:placeholder:text-zinc-600"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm font-medium text-rose-600 dark:text-rose-400" role="alert">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="group h-12 w-full rounded-xl bg-brand-emerald text-[15px] font-semibold text-white transition-all hover:bg-brand-emerald/90 dark:hover:shadow-[0_0_15px_rgba(10,176,139,0.2)] border-none shadow-[inset_0_-1px_1px_rgba(0,0,0,0.1)]"
            >
              {isLoading ? "Signing in..." : "Sign In"}
              {!isLoading && (
                <ArrowRight className="ml-2 h-[18px] w-[18px] transition-transform group-hover:translate-x-0.5" />
              )}
            </Button>

            <div className="relative pt-2 pb-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-black/5 dark:border-white/5" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-semibold">
                <span className="bg-white/80 dark:bg-[#0e0f14]/80 px-2 text-zinc-500 backdrop-blur-md">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="h-12 w-full rounded-xl border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#181920] text-[14px] font-medium text-zinc-700 dark:text-zinc-300 transition-colors hover:bg-slate-100 dark:hover:bg-[#1e1f28] hover:text-slate-900 dark:hover:text-white"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className="mr-2.5 h-[18px] w-[18px]"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>

            <div className="text-center text-[13.5px] text-zinc-600 dark:text-zinc-400 mt-4">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-brand-emerald hover:text-brand-emerald/80 hover:underline underline-offset-4 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </form>
        </CardContent>

        <Separator className="border-t border-black/5 dark:border-white/5 bg-transparent" />

        <CardFooter className="flex justify-between px-7 py-4 bg-slate-50/50 dark:bg-[#0a0b10]/50">
          <div className="flex w-full items-center justify-center gap-5 sm:gap-7">
            <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-[#32b57b]">
              <ShieldCheck className="h-3.5 w-3.5 opacity-90" />
              ENCRYPTED
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-[#32b57b]">
              <Cpu className="h-3.5 w-3.5 opacity-90" />
              AI POWERED
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-[#32b57b]">
              <CheckCircle2 className="h-3.5 w-3.5 opacity-90" />
              SECURE
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
