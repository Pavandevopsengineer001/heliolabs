import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  icon?: ReactNode;
};

export function Button({
  className,
  variant = "primary",
  icon,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition duration-300 disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" &&
          "bg-ember text-white shadow-[0_18px_35px_rgba(255,106,0,0.22)] hover:bg-[#ff7f26]",
        variant === "secondary" &&
          "border border-black/10 bg-white text-ink hover:border-black/20 hover:bg-sand",
        variant === "ghost" && "text-ink hover:text-ember",
        className
      )}
      {...props}
    >
      {children}
      {icon}
    </button>
  );
}

