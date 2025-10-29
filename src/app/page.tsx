import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">
            User Registration
          </CardTitle>
          <CardDescription className="text-base">
            Welcome to our user registration system. Create an account or log in
            to your existing account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground text-center">
              Get started by creating a new account or logging into an existing
              one.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button asChild size="lg" className="w-full">
              <Link href="/signup">Sign Up</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full">
              <Link href="/login">Login</Link>
            </Button>
          </div>
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Secure user management system built with Next.js and NestJS
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
