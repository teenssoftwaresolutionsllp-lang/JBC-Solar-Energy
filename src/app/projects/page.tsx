import React from "react";
import Image from "next/image";
import { ProjectsGallery } from "./ProjectsGallery";
import { ImpactSection } from "@/components/home/ImpactSection";

export const metadata = {
  title: "Recent Projects | JBC Solar Energy",
  description:
    "Browse our portfolio of residential rooftops, commercial solar canopies, and utility-scale industrial installations.",
};

export default function ProjectsPage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Banner */}
      <section className="relative min-h-[380px] sm:min-h-[440px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/projects/project-featured.jpg"
            alt="Solar project installations portfolio"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/70 to-slate-900/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl">
            <span className="text-base sm:text-lg font-bold uppercase text-[#f36a26] mb-3 block">
              OUR WORK
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white tracking-tight uppercase leading-[1.05]">
              Featured Projects
            </h1>
            <p className="mt-5 text-base sm:text-lg text-slate-100 font-normal leading-relaxed">
               Explore our proven track record of 300+ completed solar installations delivering high reliability, lower costs, and clean
              energy independence.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProjectsGallery />
        </div>
      </section>

      {/* Impact Stats */}
      <ImpactSection />
    </div>
  );
}
