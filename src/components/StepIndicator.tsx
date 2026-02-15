"use client";

import { ChevronsRightIcon } from "lucide-react";

const steps = [
  { step: 1, label: "Order Summary" },
  { step: 2, label: "Billing Details" },
  { step: 3, label: "Confirm Order" },
];

export default function StepIndicator({ step }: { step: number }) {
  return (
    <div className="bg-background/50 sticky top-5 z-10 flex items-center justify-center gap-5 border-y border-dashed border-black p-5 backdrop-blur-sm">
      {steps.map((item, index) => {
        const isActive = item.step === step;
        const isCompleted = item.step < step;

        return (
          <div key={item.step} className="flex items-center gap-5">
            <div className="flex flex-col items-center justify-center gap-1 md:flex-row">
              <div
                className={`aspect-square size-5 rounded-full text-center text-sm ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : isCompleted
                      ? "bg-green-600 text-white"
                      : "bg-muted-foreground/50 text-muted"
                } `}
              >
                {item.step}
              </div>

              <span
                className={`text-center text-sm md:text-base ${
                  isActive ? "" : "text-muted-foreground"
                } `}
              >
                {item.label}
              </span>
            </div>

            {/* show arrow except last */}
            {index < steps.length - 1 && (
              <ChevronsRightIcon
                className={`size-7 md:size-5 ${
                  item.step < step ? "" : "text-muted-foreground"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
