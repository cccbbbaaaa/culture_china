import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * 自定义输入框外观 / Customize input appearance
   */
  variant?: "default";
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, variant: _variant, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "flex h-10 w-full rounded-md border border-stone bg-canvas px-3 py-2 text-sm text-ink shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ring-offset-canvas placeholder:text-ink/50 disabled:cursor-not-allowed disabled:opacity-60",
      className,
    )}
    {...props}
  />
));

Input.displayName = "Input";



