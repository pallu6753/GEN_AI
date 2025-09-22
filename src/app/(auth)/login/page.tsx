"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  return (
    <Card className="mx-auto max-w-sm w-[380px] bg-glass border-white/20 text-white backdrop-blur-lg">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription className="text-white/80">
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              className="bg-transparent border-white/40 placeholder:text-white/60"
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                href="#"
                className="ml-auto inline-block text-sm text-white/80 hover:text-white underline"
              >
                Forgot your password?
              </Link>
            </div>
            <Input id="password" type="password" required className="bg-transparent border-white/40" />
          </div>
          <Button type="submit" className="w-full" onClick={() => router.push('/dashboard')}>
            Login
          </Button>
           <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/40" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-transparent px-2 text-white/80">
                Or continue with
              </span>
            </div>
          </div>
          <Button variant="outline" className="w-full bg-transparent border-white/40 hover:bg-white/10 hover:text-white">
            <Icons.logo className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>
        </div>
        <div className="mt-4 text-center text-sm text-white/80">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline hover:text-white">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
