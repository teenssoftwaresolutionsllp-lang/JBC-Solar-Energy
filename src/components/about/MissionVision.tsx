import React from "react";
import Image from "next/image";

export function MissionVision() {
  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section label — orange uppercase small text */}
        <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#f36a26] mb-3">
          OUR MISSION & VISION
        </p>

        {/* Section heading — left-aligned, large */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] tracking-tight mb-10">
          Building a Sustainable Future
        </h2>

        {/* Three-column layout: Mission Card | Center Image | Vision Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Our Mission Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col">
            <h3 className="text-xl font-bold text-[#0f172a] mb-4">Our Mission</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              To deliver innovative, reliable and cost-effective solar energy solutions
              that empower communities and protect the environment.
            </p>
          </div>

          {/* Center Solar Image — taller, no border radius on top */}
          <div className="relative min-h-[260px] lg:min-h-auto rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <Image
              src="/images/image 9.png"
              alt="Solar panels in green landscape"
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover object-center"
            />
          </div>

          {/* Our Vision Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col">
            <h3 className="text-xl font-bold text-[#0f172a] mb-4">Our Vision</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              To be a leading solar energy company recognised for excellence, innovation
              and our contribution to a cleaner, greener planet.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
