"use client";

import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { createBillingDetailsAction } from "@/domains/billing/billing.actions";
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
  const router = useRouter();
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

  const { errors, isSubmitting, isValid } = form.formState;
  const acceptedTerms = Boolean(form.watch("acceptedTerms"));
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

    const appName = "Eventra";
    const appId = config.razorpay.key_id ?? "unknown";
    const isTestMode = appId.startsWith("rzp_test");

    const options = {
      key: config.razorpay.key_id,
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,

      name: appName,
      description: `Ticket booking (${bookingId})`,
      prefill: {
        name: data.name,
        email: data.email,
        contact: data.phone,
      },
      notes: {
        app_name: appName,
        app_id: appId,
        environment: isTestMode ? "test" : "live",
        booking_id: bookingId,
        payment_for: "event_tickets",
      },

      handler: async function (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) {
        const verifyRes = await verifyPaymentAction(response);
        if (!verifyRes.success) {
          toast.error("Payment verification failed");
          setIsProcessingPayment(false);
          return;
        }

        router.push("/events");
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
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="no-scrollbar h-full space-y-6 overflow-y-auto md:max-h-[calc(100vh-5rem)] md:py-6 lg:py-8"
    >
      <Card className="via-background border-indigo-500/15 bg-linear-to-br from-transparent to-indigo-500/5 p-4 md:p-6">
        <CardTitle className="text-base tracking-tight md:text-lg">
          Contact details
        </CardTitle>
        <section className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full name
              </Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                // className="w-full rounded-lg border border-zinc-200 bg-white/10 px-3 py-6 text-sm font-light shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                className="border-border/60 h-11 rounded-lg focus-visible:border-indigo-500/40 focus-visible:ring-4 focus-visible:ring-indigo-500/15"
                {...form.register("name")}
              />
              {errors.name?.message ? (
                <p className="text-destructive text-xs">
                  {errors.name.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone
              </Label>
              <Input
                id="phone"
                placeholder="10-digit mobile number"
                className="border-border/60 h-11 rounded-lg focus-visible:border-indigo-500/40 focus-visible:ring-4 focus-visible:ring-indigo-500/15"
                {...form.register("phone")}
              />
              {errors.phone?.message ? (
                <p className="text-destructive text-xs">
                  {errors.phone.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="border-border/60 h-11 rounded-lg focus-visible:border-indigo-500/40 focus-visible:ring-4 focus-visible:ring-indigo-500/15"
              {...form.register("email")}
            />
            <p className="text-muted-foreground pt-3 text-xs">
              Your tickets and invoice will be sent to this email.
            </p>
            {errors.email?.message ? (
              <p className="text-destructive text-xs">{errors.email.message}</p>
            ) : null}
          </div>
        </section>
      </Card>

      <Card className="via-background border-indigo-500/15 bg-linear-to-br from-transparent to-indigo-500/5 p-4 md:p-6">
        <CardTitle className="text-base tracking-tight">
          Billing address
        </CardTitle>
        <section className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nationality" className="text-sm font-medium">
                Nationality
              </Label>
              <Input
                id="nationality"
                placeholder="e.g. Indian"
                className="border-border/60 h-11 rounded-lg focus-visible:border-indigo-500/40 focus-visible:ring-4 focus-visible:ring-indigo-500/15"
                {...form.register("nationality")}
              />
              {errors.nationality?.message ? (
                <p className="text-destructive text-xs">
                  {errors.nationality.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state" className="text-sm font-medium">
                State
              </Label>
              <Input
                id="state"
                placeholder="e.g. Maharashtra"
                className="border-border/60 h-11 rounded-lg focus-visible:border-indigo-500/40 focus-visible:ring-4 focus-visible:ring-indigo-500/15"
                {...form.register("state")}
              />
              {errors.state?.message ? (
                <p className="text-destructive text-xs">
                  {errors.state.message}
                </p>
              ) : null}
            </div>
          </div>
        </section>
      </Card>

      <Card className="via-background border-indigo-500/15 bg-linear-to-br from-transparent to-indigo-500/5 p-4 md:p-6">
        <CardTitle className="text-lg tracking-tight">Payment</CardTitle>
        <section className="space-y-6">
          <RadioGroup defaultValue="upi" className="gap-3">
            <PaymentOption
              value="upi"
              title="UPI"
              description="Pay instantly using UPI apps like GPay, PhonePe, Paytm."
              icon={<UpiMark />}
            />
            <PaymentOption
              value="card"
              title="Credit / Debit card"
              description="Visa, Mastercard and most major cards supported."
              icon={
                <div className="flex items-center gap-2">
                  <VisaMark />
                  <MastercardMark />
                </div>
              }
            />
            <PaymentOption
              value="wallet"
              title="Wallets"
              description="Use supported wallets during the secure payment step."
              icon={<WalletMark />}
            />
          </RadioGroup>

          <Separator />

          <div className="flex items-start gap-3">
            <Checkbox
              id="acceptedTerms"
              checked={acceptedTerms}
              onCheckedChange={(checked) =>
                form.setValue("acceptedTerms", Boolean(checked), {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              className="mt-0.5"
            />
            <div className="space-y-2">
              <Label
                htmlFor="acceptedTerms"
                className="text-sm leading-5 font-normal"
              >
                I agree to the{" "}
                <Link
                  href="/terms-and-conditions"
                  className="text-foreground underline underline-offset-4"
                >
                  terms and conditions
                </Link>
                .
              </Label>
              {errors.acceptedTerms?.message ? (
                <p className="text-destructive text-xs">
                  {errors.acceptedTerms.message}
                </p>
              ) : null}
            </div>
          </div>

          <Button
            type="submit"
            className="h-12 w-full rounded-lg bg-linear-to-r from-indigo-600 to-cyan-600 text-white shadow-sm shadow-indigo-500/10 hover:from-indigo-600/90 hover:to-cyan-600/90 focus-visible:ring-4 focus-visible:ring-indigo-500/20 focus-visible:outline-none disabled:from-indigo-600/30 disabled:to-cyan-600/30 disabled:text-white"
            disabled={
              isSubmitting || isProcessingPayment || !isValid || !acceptedTerms
            }
            isLoading={isSubmitting || isProcessingPayment}
          >
            <span className="flex items-center justify-center gap-2">
              <Lock className="size-4" />
              Pay now
            </span>
          </Button>
          <p className="text-muted-foreground text-center text-xs">
            Secure checkout powered by Razorpay.
          </p>
        </section>
      </Card>
    </form>
  );
}

function PaymentOption({
  value,
  title,
  description,
  icon,
}: {
  value: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  const id = `payment-${value}`;
  return (
    <div className="relative">
      <RadioGroupItem id={id} value={value} className="peer sr-only" />
      <Label htmlFor={id} className="block cursor-pointer">
        <div className="border-border/60 bg-background hover:bg-muted/20 flex items-start justify-between gap-4 rounded-xl border p-4 transition-colors peer-data-[state=checked]:border-indigo-600 peer-data-[state=checked]:ring-4 peer-data-[state=checked]:ring-cyan-500/15">
          <div className="space-y-2">
            <p className="text-sm font-medium md:text-[15px]">{title}</p>
            <p className="text-muted-foreground text-xs leading-5 font-normal md:text-[13px]">
              {description}
            </p>
          </div>
          <div className="text-muted-foreground shrink-0">{icon}</div>
        </div>
      </Label>
    </div>
  );
}

function VisaMark() {
  return (
    <svg
      aria-label="Visa"
      viewBox="0 0 60 20"
      className="text-foreground h-5 w-auto"
      role="img"
    >
      <rect width="60" height="20" rx="4" fill="currentColor" opacity="0.08" />
      <path
        d="M14.2 14.6H11.7L10.1 6.2h2.5l1.6 8.4ZM22.5 6.4a6.5 6.5 0 0 0-2.3-.4c-2.5 0-4.3 1.2-4.3 3 0 1.3 1.3 2 2.3 2.4 1 .4 1.4.7 1.4 1.1 0 .6-.8.9-1.6.9-.9 0-1.8-.2-2.4-.5l-.3-.2-.4 2.1c.6.2 1.7.5 2.9.5 2.7 0 4.5-1.2 4.5-3.1 0-1-.7-1.8-2.3-2.4-1-.4-1.6-.7-1.6-1.1 0-.4.5-.8 1.6-.8.9 0 1.5.2 2 .4l.2.1.4-2Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M29.6 6.2h-2c-.6 0-1 .2-1.2.7l-3.8 7.7H25l.5-1.3h3l.3 1.3h2.2l-1.9-8.4Zm-3.4 5.4 1.2-3 0 0 .6 3h-1.8Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M40.8 6.2 38.4 14.6H36l-1.5-5.5c-.1-.4-.2-.6-.6-.8A9 9 0 0 0 31.8 7l.1-.8h3.7c.5 0 1 .3 1.1.7l.8 4.1 2-4.8h2.3Z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  );
}

function MastercardMark() {
  return (
    <svg
      aria-label="Mastercard"
      viewBox="0 0 60 20"
      className="text-foreground h-5 w-auto"
      role="img"
    >
      <rect width="60" height="20" rx="4" fill="currentColor" opacity="0.08" />
      <circle cx="28" cy="10" r="5.2" fill="currentColor" opacity="0.35" />
      <circle cx="34" cy="10" r="5.2" fill="currentColor" opacity="0.55" />
      <path
        d="M31 5.7a6.4 6.4 0 0 0 0 8.6 6.4 6.4 0 0 0 0-8.6Z"
        fill="currentColor"
        opacity="0.8"
      />
      <path
        d="M18 14.4V5.6h1.8l2.1 5.8 2.1-5.8H26v8.8h-1.3V7.9l-2.2 6.5h-1.2l-2.2-6.5v6.5H18Z"
        fill="currentColor"
        opacity="0.85"
      />
      <path
        d="M41 14.4V5.6h3.3c1.9 0 3 1 3 2.7 0 1.8-1.1 2.8-3 2.8h-1.9v3.3H41Zm1.4-4.5h1.9c1 0 1.6-.5 1.6-1.6S45.3 6.8 44.3 6.8h-1.9v3.1Z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
}

function UpiMark() {
  return (
    <div className="border-border/60 text-foreground inline-flex h-5 items-center rounded-md border px-2 text-[11px] font-medium">
      UPI
    </div>
  );
}

function WalletMark() {
  return (
    <div className="border-border/60 text-foreground inline-flex h-5 items-center rounded-md border px-2 text-[11px] font-medium">
      Wallet
    </div>
  );
}
