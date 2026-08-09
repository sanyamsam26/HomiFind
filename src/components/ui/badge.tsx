import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-emerald-100 text-emerald-800 border border-emerald-200",
        secondary: "bg-slate-100 text-slate-700 border border-slate-200",
        destructive: "bg-rose-100 text-rose-800 border border-rose-200",
        warning: "bg-amber-100 text-amber-800 border border-amber-200",
        outline: "text-slate-900 border border-slate-300",
        renter: "bg-teal-50 text-teal-700 border border-teal-200",
        owner: "bg-indigo-50 text-indigo-700 border border-indigo-200",
        broker: "bg-purple-50 text-purple-700 border border-purple-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  className?: string;
  children?: React.ReactNode;
}

export function Badge({ className, variant, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </div>
  );
}

