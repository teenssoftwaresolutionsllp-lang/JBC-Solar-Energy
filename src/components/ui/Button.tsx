import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "dark" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

  const sizeStyles = {
    sm: "px-4 py-2 text-sm rounded-lg gap-1.5",
    md: "px-6 py-2.5 text-base rounded-full gap-2",
    lg: "px-8 py-3.5 text-base rounded-full font-semibold gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-[#f36a26] text-white hover:bg-[#e05514] focus:ring-[#f36a26] shadow-sm hover:shadow-md",
    secondary:
      "bg-white/10 backdrop-blur-md text-white border border-white/40 hover:bg-white/20 focus:ring-white",
    dark:
      "bg-[#111827] text-white hover:bg-[#1f2937] focus:ring-[#111827] shadow-sm",
    outline:
      "border-2 border-[#f36a26] text-[#f36a26] hover:bg-[#f36a26] hover:text-white focus:ring-[#f36a26]",
    ghost:
      "text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:ring-slate-400",
  };

  const combinedClasses = cn(
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    className
  );

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
}
