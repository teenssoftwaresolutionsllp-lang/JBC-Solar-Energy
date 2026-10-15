import React from "react";
import Image from "next/image";
import { FaqAccordion } from "./FaqAccordion";

export const metadata = {
  title: "Frequently Asked Questions | JBC Solar Energy",
  description:
    "Find answers to common questions regarding solar installation costs, timelines, warranties, tax incentives, and battery storage.",
};

export default function FaqPage() {
  return (
    <div className="flex flex-col w-full">
      {/* FAQ Hero */}
      <section className="relative min-h-[380px] sm:min-h-[440px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/faq-hero.jpg"
            alt="Solar questions and answers"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-sky-950/85 via-slate-900/70 to-slate-900/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#f36a26] mb-3 block">
              HELP & GUIDANCE
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white tracking-tight uppercase leading-[1.05]">
              Frequently Asked Questions
            </h1>
            <p className="mt-5 text-base sm:text-lg text-slate-100 font-normal leading-relaxed">
              Clear answers to your questions about going solar, from financing
              and system longevity to installation and maintenance.
            </p>
          </div>
        </div>
      </section>

      {/* Accordion Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FaqAccordion />
        </div>
      </section>
    </div>
  );
}
