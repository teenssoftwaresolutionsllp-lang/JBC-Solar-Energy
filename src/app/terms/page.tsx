import React from "react";
import { Container } from "@/components/ui/Container";

export const metadata = {
  title: "Terms & Conditions | JBC Solar Energy",
  description: "Terms and conditions for JBC Solar Energy.",
};

export default function TermsPage() {
  return (
    <div className="py-20 md:py-28 bg-white">
      <Container size="narrow">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] mb-8">
          Terms & Conditions
        </h1>
        <div className="prose prose-slate max-w-none space-y-6 text-slate-600 leading-relaxed text-sm sm:text-base">
          <p>Last updated: January 2026</p>
          <p>
            Welcome to the JBC Solar Energy website. By accessing or using this
            website, you agree to comply with and be bound by the following terms
            and conditions of use.
          </p>
          <h2 className="text-xl font-bold text-[#0f172a] pt-4">
            1. Solar Estimates & Proposals
          </h2>
          <p>
            Any online quotes or preliminary assessments provided on this site
            are estimates based on user-provided information and typical
            regional solar irradiance. Formal installation proposals require
            an engineering site survey and final electrical audit.
          </p>
          <h2 className="text-xl font-bold text-[#0f172a] pt-4">
            2. Intellectual Property
          </h2>
          <p>
            All content, graphics, diagrams, and photography on this website are
            the exclusive property of JBC Solar Energy and protected under
            applicable copyright laws.
          </p>
        </div>
      </Container>
    </div>
  );
}
