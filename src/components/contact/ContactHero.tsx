import React from "react";
import Image from "next/image";

export function ContactHero() {
  return (
    <section className="relative min-h-[340px] sm:min-h-[400px] flex items-end overflow-hidden">
      {/* Background: workers on solar roof */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/contact/hero-contact.jpg"
          alt="Solar technicians walking on rooftop solar array"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* No heavy overlay — preserve the bright blue sky look from screenshot */}
        <div className="absolute inset-0 bg-gradient-to-r from-sky-900/60 via-sky-800/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </div>

      {/* Text — bottom left */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 w-full">
        <div className="max-w-xl">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white tracking-tight uppercase leading-[1.05] drop-shadow-md">
            WE&apos;RE HERE TO HELP
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-100 font-normal leading-relaxed drop-shadow max-w-sm">
            Questions about solar, a current project or your system? Speak with our friendly team.
          </p>
        </div>
      </div>
    </section>
  );
}
