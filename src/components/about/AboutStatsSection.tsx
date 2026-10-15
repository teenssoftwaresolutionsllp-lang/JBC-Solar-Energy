import React from "react";
import Image from "next/image";
import { siteConfig } from "@/data/site";

export function AboutStatsSection() {
  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      {/* Full-width background solar panel image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/image 7.png"
          alt="Solar installation background"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Light overlay to keep numbers readable */}
        <div className="absolute inset-0 bg-white/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {siteConfig.stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <span className="text-4xl sm:text-5xl font-black text-[#f36a26] tracking-tight">
                {stat.value}
              </span>
              <span className="mt-2 text-sm sm:text-base font-medium text-slate-600">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
