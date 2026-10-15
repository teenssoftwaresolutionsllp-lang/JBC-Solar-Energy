import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f36a26] rounded-lg",
        className
      )}
      aria-label="JBC Solar Energy Homepage"
    >
      <Image
        src="/images/logo.png"
        alt="JBC Solar Energy"
        width={120}
        height={40}
        priority
        className="object-contain"
        style={{ height: "40px", width: "auto" }}
      />
    </Link>
  );
}
