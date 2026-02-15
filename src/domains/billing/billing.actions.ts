"use server";

import { z } from "zod";

import { createBillingDetails } from "./billing.dal";
import { BillingDetailsInput, BillingDetailsSchema } from "./billing.schema";

export const createBillingDetailsAction = async (data: BillingDetailsInput) => {
  const parsed = BillingDetailsSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      status: 400,
      message: "Invalid billing details data",
      errors: z.treeifyError(parsed.error),
    };
  }

  try {
    const billingDetails = await createBillingDetails(parsed.data);

    return {
      success: true,
      status: 201,
      message: "Billing details created successfully",
      data: billingDetails,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      status: 500,
      message: "Internal server error",
    };
  }
};
