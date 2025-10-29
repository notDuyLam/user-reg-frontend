"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { registerSchema, type RegisterFormData } from "@/lib/validations";
import { registerUser, type ErrorResponse } from "@/lib/api";
import { AxiosError } from "axios";
import { parseApiError } from "@/lib/utils";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      form.reset();
      setSuccessMessage("Registration successful! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
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
  });

  const onSubmit = (data: RegisterFormData) => {
    setSuccessMessage(null);
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">
            Create Account
          </CardTitle>
          <CardDescription>
            Enter your email and password to create a new account
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
                        placeholder="SecurePass123!"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <div className="text-xs text-muted-foreground mt-1">
                      Must be at least 8 characters with uppercase, lowercase,
                      number, and special character
                    </div>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Registering..." : "Sign Up"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              Already have an account?{" "}
            </span>
            <Link
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
