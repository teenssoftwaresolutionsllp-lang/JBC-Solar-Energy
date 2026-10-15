import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Ramesh kumar",
    role: "Homeowner, Hyderabad",
    image: "/images/testimonials/customer-illustration-1.svg",
    stars: 5,
  },
  {
    name: "Suresh Reddy",
    role: "Industrial Client, Pune",
    image: "/images/testimonials/customer-illustration-2.svg",
    stars: 5,
  },
  {
    name: "RaghuChaitanya",
    role: "Business Owner, Hyderabad",
    image: "/images/testimonials/customer-illustration-3.svg",
    stars: 5,
  },
  {
    name: "Ravi Krishna",
    role: "Homeowner, Hyderabad",
    image: "/images/testimonials/customer-illustration-4.svg",
    stars: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-14 md:py-20 bg-white" id="testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* GREEN label */}
        <p className="text-sm font-bold text-[#22c55e] mb-2 tracking-wide">
          Testimonials
        </p>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0f172a] mb-2 tracking-tight">
          What Our Customers Say
        </h2>

        <p className="text-sm text-slate-500 mb-12 leading-relaxed">
          Hear from our satisfied customers who made the switch to solar with JBC.
        </p>

        {/* 4 arch-top cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-[#edf7ee] rounded-t-[130px] rounded-b-3xl flex flex-col items-center text-center overflow-hidden pt-6 pb-6 shadow-sm hover:shadow-md transition-all duration-300 border border-[#e0f2e2]"
            >
              {/* Photo inside arch container */}
              <div className="relative w-full aspect-[4/5] max-w-[220px] mb-4 overflow-hidden rounded-t-[110px]">
                <Image
                  src={t.image}
                  alt={t.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="object-cover object-top"
                />
              </div>

              {/* Name */}
              <h3 className="text-base font-bold text-[#0f172a] mb-1">
                {t.name}
              </h3>

              {/* Role / location */}
              <p className="text-xs text-slate-500 mb-3 font-normal">
                {t.role}
              </p>

              {/* 5 Yellow Stars */}
              <div className="flex items-center justify-center gap-1">
                {[...Array(t.stars)].map((_, si) => (
                  <Star
                    key={si}
                    className="w-4 h-4 fill-amber-400 stroke-amber-400"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
