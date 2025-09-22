"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SignupPage() {
    const router = useRouter();

  return (
    <Card className="mx-auto max-w-sm w-[380px] bg-glass border-white/20 text-white backdrop-blur-lg">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription className="text-white/80">
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
                <Label htmlFor="first-name">Full Name</Label>
                <Input id="full-name" placeholder="Priya Sharma" required className="bg-transparent border-white/40 placeholder:text-white/60"/>
          </div>
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
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" className="bg-transparent border-white/40" />
          </div>
          <Button type="submit" className="w-full" onClick={() => router.push('/dashboard')}>
            Create an account
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
            Sign up with Google
          </Button>
        </div>
        <div className="mt-4 text-center text-sm text-white/80">
          Already have an account?{" "}
          <Link href="/login" className="underline hover:text-white">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
