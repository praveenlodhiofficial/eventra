"use client";

import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { FaGoogle } from "react-icons/fa6";
import { SiGithub } from "react-icons/si";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignInAction } from "@/domains/auth/auth.actions";
import { SignInInput, SignInSchema } from "@/domains/auth/auth.schema";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<SignInInput>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: SignInInput) {
    startTransition(async () => {
      const result = await SignInAction(data);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.push("/");
    });
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="grid h-full w-full md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        {/* LEFT PANEL */}
        <div className="bg-muted relative hidden items-center justify-center md:flex">
          <Image
            src="/event2.jpg"
            alt="Sign in left panel"
            fill
            className="h-full w-full object-cover object-top"
          />
        </div>

        {/* RIGHT PANEL */}
        <div className="flex items-center justify-center bg-radial from-red-500/10 to-red-500/5 px-6 py-10 sm:px-10">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full max-w-md space-y-6"
            >
              {/* HEADER */}
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                  Welcome back
                </h1>

                <p className="text-muted-foreground text-sm md:text-base">
                  Sign in to your account to continue.
                </p>
              </div>

              {/* INPUTS */}
              <div className="space-y-4">
                {/* EMAIL */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Email address"
                          className="bg-background/70 h-11 rounded-lg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* PASSWORD */}
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
                            className="bg-background/70 h-11 rounded-lg pr-10"
                            {...field}
                          />

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground absolute top-1/2 right-2 h-8 w-8 -translate-y-1/2"
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

                      <FormMessage className="text-xs font-medium" />
                    </FormItem>
                  )}
                />
              </div>

              {/* SIGN IN BUTTON */}
              <Button
                variant="default"
                type="submit"
                className="h-11 w-full rounded-lg text-sm md:text-base"
              >
                Sign in
              </Button>

              {/* DIVIDER */}
              <div className="text-muted-foreground relative py-2 text-center text-xs tracking-wider uppercase">
                <span className="relative z-10 bg-transparent px-2">
                  Or continue with
                </span>
                <div className="bg-border absolute top-1/2 left-0 h-px w-full -translate-y-1/2" />
              </div>

              {/* SOCIAL LOGIN */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="flex h-11 items-center justify-center gap-2 rounded-lg text-sm md:text-base"
                >
                  <SiGithub className="h-4 w-4" />
                  GitHub
                </Button>

                <Button
                  variant="outline"
                  className="flex h-11 items-center justify-center gap-2 rounded-lg text-sm md:text-base"
                >
                  <FaGoogle className="h-4 w-4" />
                  Google
                </Button>
              </div>

              {/* SIGN UP */}
              <div className="text-muted-foreground pt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="/sign-up"
                  className="text-primary font-medium hover:underline"
                >
                  Sign up
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
