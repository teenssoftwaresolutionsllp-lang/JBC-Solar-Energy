import React from "react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-[400px] lg:min-h-[460px] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="h-full w-full object-cover object-center"
        >
          <source src="/solar-hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
        <div className="max-w-xl">
          {/* Italic bold heading — exactly like design */}
          <h1 className="w-max max-w-none text-[clamp(1.5rem,7vw,4.5rem)] font-black text-white uppercase leading-[1.05] tracking-tight drop-shadow-lg">
            <span className="block">POWERING A</span>
            <span className="block whitespace-nowrap">BRIGHTER TOMORROW</span>
          </h1>

          <p className="mt-4 text-sm sm:text-[15px] text-slate-200 font-normal leading-relaxed max-w-sm drop-shadow">
             Reliable solar solutions for homes, businesses, and industries. Reduce energy costs, increase energy independence, and move toward a cleaner future          </p>

          {/* Two CTA buttons — exactly as in design */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            {/* Orange filled */}
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-2.5 rounded-full bg-[#f36a26] hover:bg-[#e05514] text-white text-sm font-semibold transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              Get a Free Solar Quote</Link>

            {/* White border outlined */}
            <Link
              href="/solutions"
              className="inline-flex items-center px-6 py-2.5 rounded border-2 border-white text-white text-sm font-semibold hover:bg-white/10 transition-all active:scale-[0.98]"
            >
              Explore Our Solutions
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
