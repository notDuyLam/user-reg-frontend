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
import { registerUser } from "@/lib/api";
import { AxiosError } from "axios";

interface ErrorResponse {
  statusCode?: number;
  message: string | string[];
  error?: string;
}

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
      if (error.response?.status === 409) {
        form.setError("email", {
          type: "server",
          message: "This email is already registered. Please log in instead.",
        });
      } else if (error.response?.status === 400) {
        const message = error.response.data.message;
        if (Array.isArray(message)) {
          // Handle multiple validation errors
          if (message.some((m) => m.includes("email"))) {
            form.setError("email", {
              type: "server",
              message: "Please provide a valid email address",
            });
          }
          if (message.some((m) => m.includes("Password"))) {
            form.setError("password", {
              type: "server",
              message:
                message.find((m) => m.includes("Password")) ||
                "Invalid password",
            });
          }
        } else {
          form.setError("root", {
            type: "server",
            message: typeof message === "string" ? message : "Validation error",
          });
        }
      } else if (error.response?.status === 500) {
        form.setError("root", {
          type: "server",
          message: "Server error. Please try again later.",
        });
      } else {
        const message = error.response?.data.message;
        form.setError("root", {
          type: "server",
          message:
            typeof message === "string"
              ? message
              : "Registration failed. Please try again.",
        });
      }
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
                <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 p-3 rounded-md">
                  {form.formState.errors.root.message}
                </div>
              )}

              {successMessage && (
                <div className="text-sm text-green-600 dark:text-green-500 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 p-3 rounded-md">
                  {successMessage}
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
