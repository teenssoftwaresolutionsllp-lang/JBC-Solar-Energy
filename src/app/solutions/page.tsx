import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Solar Solutions | JBC Solar Energy",
  description:
    "Explore JBC Solar Energy's residential, commercial, industrial and rooftop solar solutions. End-to-end EPC and maintenance services.",
};

const solutions = [
  {
    id: "residential",
    title: "Residential solar",
    desc: "Power your home with clean,reliable,and affordable energy.",
    image: "/images/image 6.png",
  },
  {
    id: "commercial",
    title: "Commercial solar",
    desc: "Reduce operating costs with reliable solar solutions designed for businesses.",
    image: "/images/image 7.png",
  },
  {
    id: "individual",
    title: "Industrial Solar",
    desc: " Improve energy efficiency and reduce operating costs with scalable industrial solar systems.",
    image: "/images/image 9.png",
  },
  {
    id: "rooftop",
    title: "Rooftop Solar",
    desc: " Make the most of your available roof space with a professionally designed solar system.",
    image: "/images/image 11.png",
  },
  {
    id: "epc",
    title: "Solar EPC",
    desc: "Complete solar project management from engineering andprocurement to installation and commissioning.",
    image: "/images/image 8.png",
  },
  {
    id: "maintenance",
    title: "Maintenance & Support",
    desc: " Keep your solar system performing at its best with professional monitoring and maintenance.",
    image: "/images/image 17.png",
  },
];

export default function SolutionsPage() {
  return (
    <div className="flex flex-col w-full">
      {/* ── Hero ── */}
      <section className="relative min-h-[340px] sm:min-h-[400px] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/image1.png"
            alt="Solar panels at sunset with wind turbine"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Gradient: dark on bottom-left, fades right */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Hero text — bottom-left like design */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 w-full">
          <div className="max-w-xl">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white uppercase leading-[1.05] tracking-tight drop-shadow-md mb-6">
              EXPERTLY MANAGED<br />FROM START TO<br />SUNLIGHT
            </h1>

            {/* Orange "Get a Free Solar Quote" button exactly as in design */}
            <Button
              href="/contact"
              variant="primary"
              size="md"
              className="rounded-full font-semibold text-white shadow-lg"
            >
              <span>Get a Free Solar Quote</span>
            </Button>
          </div>
        </div>
      </section>

      {/* ── 6-Card Solutions Grid ── */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Plain heading — no badge, matches design */}
          <h2 className="text-xl sm:text-2xl font-bold text-[#0f172a] mb-8">
            Tailored solar solutions for every need
          </h2>

          {/* 3-column × 2-row grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {solutions.map((sol) => (
              <div
                key={sol.id}
                id={sol.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 scroll-mt-24 flex flex-col"
              >
                {/* Card image — no border radius, fills full width */}
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100">
                  <Image
                    src={sol.image}
                    alt={sol.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Card text content */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-base font-bold text-[#0f172a] mb-1.5">
                    {sol.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4 flex-1">
                    {sol.desc}
                  </p>

                  {/* "Learn More" orange link text — matching design */}
                  <Link
                    href={`/contact`}
                    className="inline-flex items-center text-sm font-semibold text-[#f36a26] hover:text-[#e05514] transition-colors"
                  >
                    Learn More
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── white bg, centered orange button */}
      <section className="py-14 bg-white">
        <div className="flex justify-center">
          <Button
            href="/contact"
            variant="primary"
            size="lg"
            className="rounded-full font-semibold text-white shadow-md"
          >
            <span>Get a Free Solar Quote</span>
          </Button>
        </div>
      </section>
    </div>
  );
}
