import React from "react";
import { cn } from "../../lib/utils";

interface AvatarProps {
  src?: string;
  name?: string;
  role?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Avatar({ src, name = "User", role, size = "md", className }: AvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="relative inline-block">
      {src ? (
        <img
          src={src}
          alt={name}
          className={cn(
            "rounded-full object-cover ring-2 ring-white border border-slate-200 shadow-xs",
            sizeClasses[size],
            className
          )}
        />
      ) : (
        <div
          className={cn(
            "flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 font-bold text-white ring-2 ring-white shadow-xs",
            sizeClasses[size],
            className
          )}
        >
          {initials}
        </div>
      )}
      {role && (
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 block h-3.5 w-3.5 rounded-full ring-2 ring-white",
            role === "renter"
              ? "bg-teal-500"
              : role === "owner"
              ? "bg-indigo-500"
              : role === "broker"
              ? "bg-purple-500"
              : "bg-emerald-500"
          )}
          title={`Role: ${role}`}
        />
      )}
    </div>
  );
}
