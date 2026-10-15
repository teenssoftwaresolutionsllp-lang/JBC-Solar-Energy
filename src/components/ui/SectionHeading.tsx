import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  badge?: string;
  badgeType?: "pill" | "line" | "simple";
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
}

export function SectionHeading({
  badge,
  badgeType = "pill",
  title,
  subtitle,
  align = "center",
  className,
  titleClassName,
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col mb-10 md:mb-14",
        isCenter ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {badge && (
        <div className="mb-3">
          {badgeType === "line" ? (
            <div className="flex items-center gap-2">
              <span className="w-6 h-[3px] bg-[#f36a26] rounded-full inline-block"></span>
              <span className="text-xs sm:text-sm font-bold tracking-wider text-[#0284c7] uppercase">
                {badge}
              </span>
            </div>
          ) : badgeType === "pill" ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#eaf5ed] text-[#16a34a] border border-[#d1ecd7]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]"></span>
              {badge}
            </span>
          ) : (
            <span className="text-xs sm:text-sm font-bold tracking-widest text-[#f36a26] uppercase">
              {badge}
            </span>
          )}
        </div>
      )}

      <h2
        className={cn(
          "text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0f172a] tracking-tight leading-[1.2]",
          titleClassName
        )}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className={cn(
            "mt-4 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed",
            isCenter ? "mx-auto" : ""
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
