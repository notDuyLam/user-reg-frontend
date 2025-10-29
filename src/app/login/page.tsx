"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { loginUser, type ErrorResponse } from "@/lib/api";
import { AxiosError } from "axios";
import { parseApiError } from "@/lib/utils";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { loginSchema, type LoginFormData } from "@/lib/validations";

export default function LoginPage() {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (payload: LoginFormData) => loginUser(payload),
    onSuccess: () => {
      form.reset();
      setSuccessMessage("Login successful! Redirecting...");
      setTimeout(() => {
        router.push("/users");
      }, 1000);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const parsed = parseApiError(error);
      if (parsed.fieldErrors.email) {
        form.setError("email", {
          type: "server",
          message: parsed.fieldErrors.email,
        });
      }
      if (parsed.fieldErrors.password) {
        form.setError("password", {
          type: "server",
          message: parsed.fieldErrors.password,
        });
      }
      form.setError("root", { type: "server", message: parsed.userMessage });
    },
    onSettled: () => setIsSubmitting(false),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setSuccessMessage(null);
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">
            Login
          </CardTitle>
          <CardDescription>
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {form.formState.errors.root && (
                <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300">
                  <AlertCircle className="h-4 w-4 mt-0.5" />
                  <div>
                    <div className="font-medium">There was a problem</div>
                    <div className="text-sm">
                      {form.formState.errors.root.message}
                    </div>
                  </div>
                </div>
              )}

              {successMessage && (
                <div className="flex items-start gap-2 rounded-md border border-green-200 bg-green-50 p-3 text-green-700 dark:border-green-900/40 dark:bg-green-950/30 dark:text-green-300">
                  <CheckCircle2 className="h-4 w-4 mt-0.5" />
                  <div>
                    <div className="font-medium">Success</div>
                    <div className="text-sm">{successMessage}</div>
                  </div>
                </div>
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="user@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              Don't have an account?{" "}
            </span>
            <Link
              href="/signup"
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
