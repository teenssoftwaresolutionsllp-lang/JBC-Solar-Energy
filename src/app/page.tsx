import React from "react";
import { Hero } from "@/components/home/Hero";
import { Benefits } from "@/components/home/Benefits";
import { SolutionsSection } from "@/components/home/SolutionsSection";
import { WhyJBC } from "@/components/home/WhyJBC";
import { ProcessSection } from "@/components/home/ProcessSection";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import { ImpactSection } from "@/components/home/ImpactSection";
import { Testimonials } from "@/components/home/Testimonials";

export const metadata = {
  title: "JBC Solar Energy | Powering a Brighter Tomorrow",
  description:
    "Smart solar solutions, professionally delivered. Residential, commercial, and industrial solar installations with 25-year warranty and top tier engineering.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <Benefits />
      <SolutionsSection />
      <WhyJBC />
      <ProcessSection />
      <ProjectsSection />
      <ImpactSection />
      <Testimonials />
    </div>
  );
}
