"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const slides = [
  {
    id: "solar-image-1",
    category: "Solar Farm Installation",
    desc: "Aerial view of solar arrays installed across an open field.",
    image: "/images/solar-image-1.jpg",
  },
  {
    id: "solar-image-2",
    category: "Solar Farm Overview",
    desc: "A wide view of a solar installation surrounded by green landscape.",
    image: "/images/solar-image-2.jpg",
  },
  {
    id: "residential",
    category: "Residential Solar",
    desc: "Power your home with clean,reliable,and affordable energy.",
    image: "/images/image 11.png",
  },
  {
    id: "commercial",
    category: "Commercial Solar",
    desc: "Reduce operating costs with reliable solar solutions designed for businesses.",
    image: "/images/image 7.png",
  },
  {
    id: "industrial",
    category: "Industrial Solar",
    desc: "High-capacity solutions for industries.",
    image: "/images/image 8.png",
  },
];

export function ProjectsSection() {
  const [current, setCurrent] = useState(0);
  const prev = () => setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1));
  const slide = slides[current];

  return (
    <section className="relative py-16 md:py-24 overflow-hidden" id="projects">
      {/* Background with soft solar panels */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/image1.png"
          alt="Solar field background"
          fill
          loading="eager"
          sizes="100vw"
          className="object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 bg-[#eef5fb]/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Heading, description, CTA */}
          <div className="lg:col-span-5">
            {/* GREEN label */}
            <p className="text-sm font-bold text-[#16a34a] mb-2 tracking-wide">
              Our Projects
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] mb-3 tracking-tight">
              Recent Projects
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-8 max-w-md">
              Explore some of our successful solar installations across homes, businesses and industries
            </p>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#000000] text-white text-sm font-semibold hover:bg-slate-800 transition-all shadow-md active:scale-[0.98]"
            >
              View All Projects
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right Column: Carousel with rounded light-blue arrow buttons */}
          <div className="lg:col-span-7 flex items-center justify-center gap-3 sm:gap-5">
            {/* Prev Arrow */}
            <button
              onClick={prev}
              aria-label="Previous Project"
              className="flex-shrink-0 w-10 h-10 rounded-full bg-[#dbeafe] hover:bg-[#bfdbfe] text-[#2563eb] flex items-center justify-center transition-all shadow-sm active:scale-95"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Project Card */}
            <div className="relative w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/50 group bg-slate-900">
              <Image
                src={slide.image}
                alt={slide.category}
                fill
                sizes="(max-width: 1024px) 100vw, 450px"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />

              {/* Dark overlay card at bottom */}
              <div className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4 bg-black/60 backdrop-blur-md rounded-2xl p-4 sm:p-5 text-white">
                <h3 className="font-bold text-base sm:text-lg mb-1">
                  {slide.category}
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 mb-3 leading-relaxed">
                  {slide.desc}
                </p>
                <Link
                  href="/projects"
                  className="inline-flex items-center text-xs sm:text-sm font-semibold text-white hover:text-amber-300 transition-colors"
                >
                  Learn More
                  <ChevronRight className="w-4 h-4 ml-0.5" />
                </Link>
              </div>
            </div>

            {/* Next Arrow */}
            <button
              onClick={next}
              aria-label="Next Project"
              className="flex-shrink-0 w-10 h-10 rounded-full bg-[#dbeafe] hover:bg-[#bfdbfe] text-[#2563eb] flex items-center justify-center transition-all shadow-sm active:scale-95"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
