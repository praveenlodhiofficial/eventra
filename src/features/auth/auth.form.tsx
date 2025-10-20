"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PasswordField, TextInputField } from "@/components/form";
import { Button } from "@/components/ui/button";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, FieldValues, Path, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { ZodSchema } from "zod";

interface Props<T extends FieldValues> {
   schema: ZodSchema<T>;
   defaultValues: T;
   onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
   type: "SIGN_IN" | "SIGN_UP";
}

export function AuthForm<T extends FieldValues>({
   type,
   schema,
   defaultValues,
   onSubmit,
}: Props<T>) {
   const router = useRouter();
   const isSignIn = type === "SIGN_IN";

   const [isLoading, setIsLoading] = useState(false);

   const form = useForm({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolver: zodResolver(schema as any) as any,
      defaultValues: defaultValues as DefaultValues<T>,
   });

   const handleSubmit: SubmitHandler<T> = async (data) => {
      setIsLoading(true);

      try {
         // Delegate to provided onSubmit for both sign-in and sign-up
         const result = await onSubmit(data);

         if (!result.success) {
            toast.error(isSignIn ? "Sign in failed" : "Error signing up", {
               description: result.error ?? "An error occurred.",
            });
            return;
         }

         if (isSignIn) {
            toast.success("Success", {
               description: "You have successfully signed in.",
            });
            // Force a page refresh to ensure the session is properly set
            window.location.href = "/";
         } else {
            toast.success("Success", {
               description: "You have successfully signed up.",
            });
            // After successful signup, redirect to sign-in
            router.push("/sign-in");
         }
      } catch (error) {
         console.error("Auth error:", error);
         toast.error(`${isSignIn ? "Sign in" : "Sign up"} failed`, {
            description: "An error occurred during authentication.",
         });
      } finally {
         setIsLoading(false);
      }
   };

   // Helper utilities for labels and input types
   const toLabel = (fieldName: string) =>
      fieldName
         .replace(/([A-Z])/g, " $1")
         .replace(/^./, (s) => s.toUpperCase())
         .trim();

   const getInputTypeForField = (fieldName: string) => {
      if (fieldName === "email") return "email" as const;
      if (fieldName === "password" || fieldName === "confirmPassword") return "password" as const;
      if (fieldName === "name") return "text" as const;
      return "text" as const;
   };

   // Helper to render a single field consistently
   const renderFormField = (fieldName: string) => (
      <FormField
         key={fieldName}
         control={form.control}
         name={fieldName as Path<T>}
         render={({ field }) => (
            <FormItem>
               <FormControl>
                  {fieldName === "password" ? (
                     <PasswordField
                        control={form.control}
                        name={fieldName as Path<T>}
                        label={toLabel(fieldName)}
                        placeholder={toLabel(fieldName)}
                     />
                  ) : fieldName === "email" ? (
                     <TextInputField
                        control={form.control}
                        name={fieldName as Path<T>}
                        label={toLabel(fieldName)}
                        placeholder={toLabel(fieldName)}
                        type="email"
                        inputClassName="border-gray-200 lowercase"
                     />
                  ) : fieldName === "confirmPassword" ? (
                     <PasswordField
                        control={form.control}
                        name={fieldName as Path<T>}
                        label={toLabel(fieldName)}
                        placeholder={toLabel(fieldName)}
                     />
                  ) : fieldName === "name" ? (
                     <TextInputField
                        control={form.control}
                        name={fieldName as Path<T>}
                        label={toLabel(fieldName)}
                        placeholder={toLabel(fieldName)}
                        type="text"
                        inputClassName="border-gray-200"
                     />
                  ) : (
                     <Input
                        required
                        type={getInputTypeForField(fieldName)}
                        {...field}
                        className="border-gray-200 focus-visible:ring-0 focus-visible:ring-offset-0"
                     />
                  )}
               </FormControl>
               <FormMessage />
            </FormItem>
         )}
      />
   );

   return (
      <div className="bg-background flex h-full min-h-screen w-full flex-col items-center justify-center">
         <div
            className="absolute inset-0 opacity-80"
            style={{
               backgroundImage: "url('/default/gradient-background.svg')",
               backgroundSize: "cover",
               backgroundPosition: "center",
               backgroundRepeat: "no-repeat",
            }}
         />
         <div
            className={`bg-card/5 shadow-foreground/20 border-background/30 mx-4 grid h-fit grid-cols-2 overflow-hidden rounded-3xl border shadow-lg backdrop-blur-2xl max-md:grid-cols-1 md:w-full ${isSignIn ? "max-w-4xl" : "max-w-5xl"}`}
         >
            <div className="flex h-full flex-col justify-start gap-7 rounded-lg p-4 md:w-full md:p-8 md:pl-12">
               <div className="flex items-center gap-2">
                  <Image
                     src="https://mir-s3-cdn-cf.behance.net/project_modules/fs/05cb00219052085.67abc18ca0c84.gif"
                     alt="logo"
                     width={30}
                     height={50}
                     className="object-cover"
                  />
                  <h1 className="text-xl font-bold">Eventra</h1>
               </div>
               <div className="">
                  <h1 className="text-2xl font-bold">
                     {isSignIn ? "Sign in to your account" : "Create your account"}
                  </h1>
                  <p className="text-muted-foreground mt-1 text-sm">
                     {isSignIn
                        ? "Please enter your email and password to sign in"
                        : "Please complete all fields to create your account"}
                  </p>
               </div>

               <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
                     {Object.keys(defaultValues).map((fieldName) => renderFormField(fieldName))}

                     <Button
                        type="submit"
                        disabled={isLoading}
                        aria-busy={isLoading}
                        className="mt-4 w-full"
                     >
                        {isSignIn ? "Sign In" : "Create Account"}
                     </Button>
                  </form>
               </Form>
            </div>

            <div className="bg-muted hidden h-full w-full md:block">
               <Image
                  src="https://mir-s3-cdn-cf.behance.net/project_modules/fs/05cb00219052085.67abc18ca0c84.gif"
                  alt="auth image"
                  width={1000}
                  height={1000}
                  className="h-full w-full object-cover contrast-110 saturate-80"
               />
            </div>
         </div>
         <p className="text-foreground relative top-7 text-center text-sm backdrop-blur-2xl">
            {isSignIn ? "New to Eventra? " : "Already have an account? "}

            <Link
               href={isSignIn ? "/sign-up" : "/sign-in"}
               className="ml-2 font-medium text-blue-600 hover:underline"
            >
               {isSignIn ? "Create an account" : "Sign in"}
            </Link>
         </p>
      </div>
   );
}
