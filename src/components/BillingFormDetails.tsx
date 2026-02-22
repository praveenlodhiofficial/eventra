"use client";

import { startTransition, useState } from "react";
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
import {
  createRazorpayOrderAction,
  verifyPaymentAction,
} from "@/domains/payment/payment.actions";
import { config } from "@/lib/config";
import { RazorpayOptions } from "@/types/razorpay";

export default function BillingFormDetails({
  bookingId,
}: {
  bookingId: string;
}) {
  const form = useForm<BillingDetailsInput>({
    resolver: zodResolver(BillingDetailsSchema),
    defaultValues: {
      bookingId: bookingId,
      name: "Praveen Kumar",
      phone: "9876543210",
      email: "praveen@example.com",
      nationality: "INDIAN",
      state: "Tamil Nadu",
      acceptedTerms: false,
    },
    mode: "onChange",
  });

  const { isSubmitting, isValid } = form.formState;
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  async function handlePayNow(data: BillingDetailsInput) {
    setIsProcessingPayment(true);

    // First, save billing details
    const billingResult = await createBillingDetailsAction(data);

    if (!billingResult.success || !billingResult.data) {
      toast.error(billingResult.message);
      setIsProcessingPayment(false);
      return;
    }

    toast.success("Billing details saved successfully");

    // Then, proceed with Razorpay payment
    const paymentRes = await createRazorpayOrderAction(bookingId);

    if (!paymentRes.success) {
      toast.error("Failed to create payment order");
      setIsProcessingPayment(false);
      return;
    }

    const order = paymentRes.order;

    if (!order) {
      toast.error("Payment order not found");
      setIsProcessingPayment(false);
      return;
    }

    const options = {
      key: config.razorpay.key_id,
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,

      handler: async function (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) {
        await verifyPaymentAction(response);
        window.location.reload();
      },
      modal: {
        ondismiss: function () {
          setIsProcessingPayment(false);
        },
      },
    };

    const rzp = new window.Razorpay(options as RazorpayOptions);
    rzp.open();
    setIsProcessingPayment(false);
  }

  function onSubmit(data: BillingDetailsInput) {
    startTransition(() => {
      handlePayNow(data);
    });
  }

  return (
    <div className="max-w-2xl space-y-10 rounded-xl bg-white/30 pt-5 pb-1 backdrop-blur-sm md:mx-auto md:space-y-5 md:rounded-2xl">
      {/* ========================================== TICKET DETAILS ========================================== */}
      <div>
        <p className="from-muted-foreground/10 to-primary/80 bg-linear-to-l p-1 px-6 text-sm font-medium text-white uppercase">
          Billing Details
        </p>
        <div className="relative m-3 md:m-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                {/* ======================================== NAME & PHONE ======================================== */}
                <FieldGroup className="mt-3 grid grid-cols-1 space-y-3 md:mt-5 md:grid-cols-2 md:space-y-0">
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
                              className="border-muted-foreground/20 rounded-lg border px-3 py-6 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 md:text-[15px]"
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
                              className="border-muted-foreground/20 rounded-lg border px-3 py-6 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 md:text-[15px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </Field>
                </FieldGroup>

                {/* ======================================== EMAIL ======================================== */}
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
                            className="border-muted-foreground/20 rounded-lg border px-3 py-6 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 md:text-[15px]"
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
                        const toggle = (
                          nationality: string,
                          checked: boolean
                        ) => {
                          if (checked) {
                            field.onChange(nationality);
                          } else {
                            field.onChange("");
                          }
                        };
                        return (
                          <FormItem>
                            <FormControl>
                              <FieldGroup className="grid grid-cols-[0.8fr_1fr] gap-3 md:grid-cols-2">
                                {NATIONALITY.map((nationality) => {
                                  const isChecked = field.value === nationality;

                                  return (
                                    <FormItem
                                      key={nationality}
                                      className="border-muted-foreground/20 flex items-center space-y-0 space-x-2 rounded-md border p-3 py-4"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          className="border-muted-foreground/40"
                                          checked={isChecked}
                                          onCheckedChange={(checked) =>
                                            toggle(
                                              nationality,
                                              Boolean(checked)
                                            )
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
                              </FieldGroup>
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
                              className="border-muted-foreground/20 rounded-lg border px-3 py-6 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 md:text-[15px]"
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
                      <FormItem className="flex items-center gap-7 md:gap-3">
                        <FormControl>
                          <Checkbox
                            checked={Boolean(field.value)}
                            onCheckedChange={field.onChange}
                            className="border-muted-foreground/40 origin-left scale-220 md:scale-100"
                          />
                        </FormControl>
                        <FormDescription className="line-clamp-2 cursor-pointer font-normal">
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

              {/* ======================================= PAY NOW BUTTON ======================================= */}
              <div className="mt-5">
                <ActionButton2
                  type="submit"
                  disabled={
                    isSubmitting ||
                    isProcessingPayment ||
                    !isValid ||
                    !form.getValues("acceptedTerms")
                  }
                  className="w-full cursor-pointer py-7 text-base disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <div className="flex items-center gap-2">
                    {isSubmitting || isProcessingPayment ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        {isSubmitting ? "Saving..." : "Processing..."}
                      </>
                    ) : (
                      "Pay Now"
                    )}
                  </div>
                </ActionButton2>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
