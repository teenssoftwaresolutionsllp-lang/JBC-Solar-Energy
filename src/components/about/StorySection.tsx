import React from "react";
import Image from "next/image";
import { Button } from "../ui/Button";
import { ArrowRight } from "lucide-react";

export function StorySection() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left Column: Story text */}
          <div className="flex flex-col items-start">
            {/* Simple orange label — no pill, no badge */}
            <p className="text-sm font-semibold text-[#f36a26] mb-3">Our story</p>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] tracking-tight leading-tight mb-6">
              Powering Homes, Businesses and Industries with Clean Energy
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed mb-8">
              <p>
                JBC Solar Energy was founded with a simple vision—to make clean and renewable energy accessible to everyone. We started our journey with a passion for sustainability and a belief that solar energy can create a brighter future for generations to come.
              </p>
              <p>
                Today, JBC is a trusted name in the solar industry, delivering high-quality solar solutions for residential, commercial and industrial clients. Our commitment to innovation, quality, reliability and customer satisfaction drives us to build a cleaner, greener and more sustainable world.
              </p>
            </div>

            <Button
              href="/contact"
              variant="dark"
              size="md"
              className="rounded-full font-semibold"
            >
              Learn More About Us
            </Button>
          </div>

          {/* Right Column: Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-100 aspect-[4/3] bg-slate-100">
            <Image
              src="/images/image 17.png"
              alt="Solar panels with wind turbines and city skyline"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
