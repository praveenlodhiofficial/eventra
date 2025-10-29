"use server";

import { OnboardingEmail } from "@/features/email/template/email.onboarding";
import config from "@/lib/config";
import { Resend } from "resend";

const resend = new Resend(config.env.resend.apiKey);

type SendOnboardingArgs = {
   to: string;
   name: string;
   ctaUrl?: string;
};

export async function sendOnboardingEmail({ to, name, ctaUrl }: SendOnboardingArgs) {
   try {
      const { data, error } = await resend.emails.send({
         from: "Eventra <onboarding@resend.dev>",
         to,
         subject: "Welcome to Eventra",
         react: OnboardingEmail({ name, ctaUrl }),
      });

      if (error) return { success: false, error };
      return { success: true, data };
   } catch (err) {
      return { success: false, error: err };
   }
}
