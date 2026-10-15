import React from "react";
import Image from "next/image";
import { Button } from "../ui/Button";
import { ArrowRight } from "lucide-react";

export function AboutHero() {
  return (
    <section className="relative min-h-[420px] sm:min-h-[480px] flex items-end overflow-hidden">
      {/* Background: aerial road + solar panels */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/about/hero-about.jpg"
          alt="JBC Solar Energy aerial view with solar panels"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Dark gradient only on left where text sits */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </div>

      {/* Content — bottom-left aligned like screenshot */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full">
        <div className="max-w-lg">
          {/* <p className="text-base sm:text-lg font-bold text-white leading-relaxed mb-2 drop-shadow">
            ABOUT
          </p> */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] drop-shadow-md mb-4">
            JBC SOLAR ENERGY
          </h1>
          <p className="text-sm sm:text-base text-slate-200 font-normal leading-relaxed drop-shadow mb-8 max-w-sm">
            We are committed to making clean, reliable and affordable energy accessible to everyone, Powering a brighter tomorrow.
          </p>
          <Button
            href="/contact"
            variant="primary"
            size="md"
            className="text-white font-semibold rounded-full"
          >
            <span>Request a free assessment</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}
