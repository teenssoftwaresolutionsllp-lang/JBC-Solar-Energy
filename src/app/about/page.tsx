import React from "react";
import { AboutHero } from "@/components/about/AboutHero";
import { StorySection } from "@/components/about/StorySection";
import { MissionVision } from "@/components/about/MissionVision";
import { AboutStatsSection } from "@/components/about/AboutStatsSection";
import { TeamSection } from "@/components/about/TeamSection";

export const metadata = {
  title: "About Us | JBC Solar Energy",
  description:
    "Learn about JBC Solar Energy, our mission to power homes and enterprises with clean energy, and meet our team of certified solar experts.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full">
      <AboutHero />
      <StorySection />
      <MissionVision />
      <AboutStatsSection />
      <TeamSection />
    </div>
  );
}
