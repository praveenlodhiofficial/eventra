"use client";

import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { ActionButton2 } from "@/components/ui/action-button";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignUpAction } from "@/domains/auth/auth.actions";
import { SignUpInput, SignUpSchema } from "@/domains/auth/auth.schema";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<SignUpInput>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: SignUpInput) {
    startTransition(async () => {
      const result = await SignUpAction(data);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.push("/sign-in");
    });
  }

  return (
    <Container className="flex h-screen items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="border-primary w-full space-y-4 rounded-xl border border-r-7 border-b-7 px-10 py-20 md:w-sm"
        >
          <div className="space-y-1 py-5">
            <h1 className="text-center text-2xl font-semibold uppercase">
              Sign Up
            </h1>
            <p className="text-muted-foreground text-center text-sm font-light">
              Create an account to get started
            </p>
          </div>

          {/* Email Input */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Email"
                    className="rounded-lg border border-zinc-200 bg-white/10 px-3 py-6 text-sm font-light shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Input */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="rounded-lg border border-zinc-200 bg-white/10 px-3 py-6 text-sm font-light shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground absolute top-1/2 right-2 h-8 w-8 -translate-y-1/2 px-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage className="text-xs font-bold" />
              </FormItem>
            )}
          />

          <ActionButton2 variant="default" type="submit" className="w-full">
            Sign Up
          </ActionButton2>

          <p className="text-muted-foreground mt-5 text-center text-sm font-light">
            Already have an account?&nbsp;
            <Link href="/sign-in" className="text-primary underline">
              Sign In
            </Link>
          </p>
        </form>
      </Form>
    </Container>
  );
}
