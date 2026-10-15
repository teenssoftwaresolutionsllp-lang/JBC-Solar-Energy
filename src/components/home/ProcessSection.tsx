"use client";

import React from "react";
import Image from "next/image";

export function ProcessSection() {
  const steps = [
    {
      num: "1",
      title: "Consultation",
      desc: "Understand Your needs & site evaluation",
      pinBg: "bg-[#22c55e]",
      circleBg: "bg-[#bbf7d0]",
      circleText: "text-[#15803d]",
    },
    {
      num: "2",
      title: "Site Survey",
      desc: "Detailed analysis & feasibility",
      pinBg: "bg-[#eab308]",
      circleBg: "bg-[#fef08a]",
      circleText: "text-[#854d0e]",
    },
    {
      num: "3",
      title: "System Design",
      desc: "Custom design for maximum output",
      pinBg: "bg-[#0284c7]",
      circleBg: "bg-[#bae6fd]",
      circleText: "text-[#0369a1]",
    },
    {
      num: "4",
      title: "Installation",
      desc: "Professional & safe installation",
      pinBg: "bg-[#22c55e]",
      circleBg: "bg-[#bbf7d0]",
      circleText: "text-[#15803d]",
    },
    {
      num: "5",
      title: "Monitoring",
      desc: "Real time performance tracking",
      pinBg: "bg-[#eab308]",
      circleBg: "bg-[#fef08a]",
      circleText: "text-[#854d0e]",
    },
  ];

  return (
    <section className="py-14 md:py-20 bg-white relative overflow-hidden" id="process">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Label & Heading matching design screenshot */}
        <p className="text-sm font-bold text-[#16a34a] mb-2 tracking-wide">
          Our Solutions
        </p>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0f172a] tracking-tight mb-8">
                 Solar Solutions for Every Need       </h2>

        {/* Scenic Panoramic Road Map Container */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl min-h-[520px] lg:min-h-[620px] bg-slate-900">
          {/* Panoramic Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/image1.png"
              alt="Solar roadway landscape"
              fill
              sizes="100vw"
              className="object-cover object-center opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/20" />
          </div>

          {/* Curved Asphalt Road SVG */}
          <div className="hidden lg:block absolute inset-0 z-10 pointer-events-none">
            <svg
              viewBox="0 0 1200 600"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              {/* Outer Road Edge */}
              <path
                d="M 60 520 C 180 520, 140 380, 240 360 C 350 340, 420 540, 580 480 C 720 430, 780 180, 1140 180"
                stroke="#18181b"
                strokeWidth="54"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* White Dashed Center Line */}
              <path
                d="M 60 520 C 180 520, 140 380, 240 360 C 350 340, 420 540, 580 480 C 720 430, 780 180, 1140 180"
                stroke="#ffffff"
                strokeWidth="4"
                strokeDasharray="20 20"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Desktop Pin Markers positioned along the roadway */}
          <div className="hidden lg:block relative z-20 w-full h-[600px]">
            {/* Step 1: Pin 1 (Green) - bottom left */}
            <div className="absolute bottom-12 left-[12%] flex items-center">
              <div className="relative flex items-center bg-white rounded-full pl-3 pr-6 py-2.5 shadow-xl border border-slate-100">
                <div className="w-12 h-12 rounded-full bg-[#86efac] text-[#15803d] font-black text-xl flex items-center justify-center mr-3 shadow-inner">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 leading-tight">Consultation</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">Understand Your needs & site evaluation</p>
                </div>
              </div>
            </div>

            {/* Step 2: Pin 2 (Yellow) - mid left */}
            <div className="absolute top-[52%] left-[4%] flex items-center">
              <div className="relative flex items-center bg-white rounded-full pl-3 pr-6 py-2.5 shadow-xl border border-slate-100">
                <div className="w-12 h-12 rounded-full bg-[#fde047] text-[#854d0e] font-black text-xl flex items-center justify-center mr-3 shadow-inner">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 leading-tight">Site Survey</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">Detailed analysis & feasibility</p>
                </div>
              </div>
            </div>

            {/* Step 3: Pin 3 (Blue) - center */}
            <div className="absolute top-[28%] left-[38%] flex items-center">
              <div className="relative flex items-center bg-white rounded-full pl-6 pr-3 py-2.5 shadow-xl border border-slate-100">
                <div className="text-right mr-3">
                  <h4 className="font-bold text-sm text-slate-900 leading-tight">System Design</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">Custom design for maximum output</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#38bdf8] text-[#0369a1] font-black text-xl flex items-center justify-center shadow-inner">
                  3
                </div>
              </div>
            </div>

            {/* Step 4: Pin 4 (Green) - bottom right */}
            <div className="absolute bottom-[18%] right-[28%] flex items-center">
              <div className="relative flex items-center bg-white rounded-full pl-6 pr-3 py-2.5 shadow-xl border border-slate-100">
                <div className="text-right mr-3">
                  <h4 className="font-bold text-sm text-slate-900 leading-tight">Installation</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">Professional & safe installation</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#86efac] text-[#15803d] font-black text-xl flex items-center justify-center shadow-inner">
                  4
                </div>
              </div>
            </div>

            {/* Step 5: Pin 5 (Yellow) - top right */}
            <div className="absolute top-[15%] right-[10%] flex items-center">
              <div className="relative flex items-center bg-white rounded-full pl-6 pr-3 py-2.5 shadow-xl border border-slate-100">
                <div className="text-right mr-3">
                  <h4 className="font-bold text-sm text-slate-900 leading-tight">Monitoring</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">Real time performance tracking</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#fde047] text-[#854d0e] font-black text-xl flex items-center justify-center shadow-inner">
                  5
                </div>
              </div>
            </div>
          </div>

          {/* Mobile list representation */}
          <div className="lg:hidden relative z-20 p-6 space-y-4">
            {steps.map((s) => (
              <div
                key={s.num}
                className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-slate-200 flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center font-black text-lg ${s.circleBg} ${s.circleText}`}>
                  {s.num}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{s.title}</h4>
                  <p className="text-xs text-slate-600 leading-snug mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
