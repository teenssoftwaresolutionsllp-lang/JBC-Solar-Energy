import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const cards = [
  {
    id: "residential",
    title: "Residential Solar",
    desc: "Power your home with clean,reliable,and affordable energy",
    image: "/images/image 6.png",
  },
  {
    id: "commercial",
    title: "Commercial Solar",
    desc: "Reduce operating costs with reliable solar solutions designed for businesses.",
    image: "/images/image 7.png",
  },
  {
    id: "industrial",
    title: "Industrial Solar",
    desc: " Improve energy efficiency and reduce operating costs with scalable industrial solar systems.",
    image: "/images/image 8.png",
  },
];

export function SolutionsSection() {
  return (
    <section className="py-14 md:py-20 bg-white" id="solutions">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Orange label */}
        <p className="text-sm font-bold text-[#f36a26] mb-2 tracking-wide">
          Our Solutions
        </p>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0f172a] tracking-tight mb-3">
                  Solar Solutions for Every Need        </h2>

        {/* Description */}
        <p className="text-sm text-slate-500 mb-10 max-w-lg leading-relaxed">
          From homes to large-scale industries, JBC offers customized solar solutions designed for maximum efficiency and long-term savings
        </p>

        {/* 3-column card grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-10">
          {cards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col"
            >
              {/* Image with rounded top */}
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-center hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-base font-bold text-[#0f172a] mb-2">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6 flex-1">
                  {card.desc}
                </p>
                <Link
                  href={`/solutions#${card.id}`}
                  className="inline-flex items-center text-sm font-bold text-[#0f172a] hover:text-[#f36a26] transition-colors"
                >
                  Learn More
                  <ChevronRight className="w-4 h-4 ml-1 stroke-[2.5]" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Dark "Explore All Solutions" button */}
        <div>
          <Link
            href="/solutions"
            className="inline-flex items-center px-7 py-3.5 rounded-lg bg-[#000000] text-white text-sm font-bold hover:bg-slate-800 transition-all shadow-sm active:scale-[0.98]"
          >
            Explore All Solutions
          </Link>
        </div>
      </div>
    </section>
  );
}
