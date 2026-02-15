"use client";

import { startTransition } from "react";
import { useForm } from "react-hook-form";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { ActionButton2 } from "@/components/ui/action-button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createBillingDetailsAction } from "@/domains/billing/billing.actions";
import { NATIONALITY } from "@/domains/billing/billing.constants";
import {
  BillingDetailsInput,
  BillingDetailsSchema,
} from "@/domains/billing/billing.schema";

export default function BillingForm({ bookingId }: { bookingId: string }) {
  const form = useForm<BillingDetailsInput>({
    resolver: zodResolver(BillingDetailsSchema),
    defaultValues: {
      bookingId: bookingId,
      name: "",
      phone: "",
      email: "",
      nationality: "INDIAN",
      state: "",
      acceptedTerms: false,
    },
  });

  const { isSubmitting } = form.formState;

  function onSubmit(data: BillingDetailsInput) {
    startTransition(async () => {
      const result = await createBillingDetailsAction(data);

      if (!result.success || !result.data) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      form.reset();
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          {/* ======================================== NAME & PHONE ======================================== */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            {/* Name */}
            <Field>
              <FieldLabel>Name</FieldLabel>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Name"
                        className="rounded-lg border px-3 py-6 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Field>

            {/* Phone Number */}
            <Field>
              <FieldLabel>Phone Number</FieldLabel>
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Phone Number"
                        className="rounded-lg border px-3 py-6 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Field>
          </div>

          {/* ======================================== EMAIL ======================================== */}
          {/* Email */}
          <Field>
            <FieldLabel>Email</FieldLabel>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      className="rounded-lg border px-3 py-6 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FieldDescription>
              We&apos;ll email you ticket confirmation and invoices
            </FieldDescription>
          </Field>

          <div className="grid gap-3">
            {/* ======================================== NATIONALITY ======================================== */}
            <Field>
              <FieldLabel>Nationality</FieldLabel>
              <FormField
                control={form.control}
                name="nationality"
                render={({ field }) => {
                  const toggle = (nationality: string, checked: boolean) => {
                    if (checked) {
                      field.onChange(nationality);
                    } else {
                      field.onChange("");
                    }
                  };
                  return (
                    <FormItem>
                      <FormControl>
                        <div className="grid grid-cols-2 gap-3">
                          {NATIONALITY.map((nationality) => {
                            const isChecked = field.value === nationality;

                            return (
                              <FormItem
                                key={nationality}
                                className="flex items-center space-y-0 space-x-2 rounded-md border p-3 py-4"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={isChecked}
                                    onCheckedChange={(checked) =>
                                      toggle(nationality, Boolean(checked))
                                    }
                                  />
                                </FormControl>

                                <FormLabel className="line-clamp-1 cursor-pointer font-normal">
                                  {nationality.charAt(0).toUpperCase() +
                                    nationality.slice(1)}
                                </FormLabel>
                              </FormItem>
                            );
                          })}
                        </div>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </Field>

            {/* ======================================== STATE ======================================== */}
            <Field>
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="State"
                        className="rounded-lg border px-3 py-6 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Field>
          </div>

          {/* ======================================== ACCEPTED TERMS ======================================== */}
          <Field>
            <FormField
              control={form.control}
              name="acceptedTerms"
              render={({ field }) => (
                <FormItem className="flex items-center space-y-0 space-x-1">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className=""
                    />
                  </FormControl>
                  <FormDescription className="line-clamp-1 cursor-pointer font-normal">
                    I have read and accepted the{" "}
                    <Link
                      href="/terms-and-conditions"
                      className="font-medium text-blue-600"
                    >
                      terms and conditions
                    </Link>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Field>
        </FieldGroup>

        {/* ======================================= SUBMIT BUTTON ======================================= */}
        <ActionButton2
          type="submit"
          disabled={isSubmitting}
          className="mt-5 w-full cursor-pointer py-7 text-base disabled:cursor-not-allowed disabled:opacity-70"
        >
          <div className="flex items-center gap-2">
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Save Billing Details"
            )}
          </div>
        </ActionButton2>
      </form>
    </Form>
  );
}
