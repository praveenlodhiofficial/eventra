import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
   HTMLTextAreaElement,
   React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
   return (
      <textarea
         className={cn(
            "bg-background ring-offset-background placeholder:text-muted-foreground focus-outline-none flex min-h-[80px] w-full rounded-md border-2 border-black/50 px-3 py-2 text-sm focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
            className
         )}
         style={{
            fontSize: "13px",
         }}
         ref={ref}
         {...props}
      />
   );
});
Textarea.displayName = "Textarea";

export { Textarea };
