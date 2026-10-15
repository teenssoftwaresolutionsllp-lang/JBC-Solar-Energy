import React from "react";
import { Container } from "@/components/ui/Container";

export const metadata = {
  title: "Privacy Policy | JBC Solar Energy",
  description: "Privacy policy for JBC Solar Energy.",
};

export default function PrivacyPage() {
  return (
    <div className="py-20 md:py-28 bg-white">
      <Container size="narrow">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] mb-8">
          Privacy Policy
        </h1>
        <div className="prose prose-slate max-w-none space-y-6 text-slate-600 leading-relaxed text-sm sm:text-base">
          <p>Last updated: January 2026</p>
          <p>
            At JBC Solar Energy ("we", "our", or "us"), we are committed to
            protecting your privacy and ensuring your personal information is
            handled responsibly.
          </p>
          <h2 className="text-xl font-bold text-[#0f172a] pt-4">
            1. Information We Collect
          </h2>
          <p>
            We collect personal information that you provide when requesting a
            solar assessment, free consultation, or contacting us via our
            website. This includes your name, phone number, email address,
            property address, and electricity bill approximations.
          </p>
          <h2 className="text-xl font-bold text-[#0f172a] pt-4">
            2. How We Use Your Information
          </h2>
          <p>
            We use this information exclusively to assess your property's
            solar potential, contact you regarding your consultation request,
            coordinate site surveys, and provide ongoing solar system monitoring
            support. We do not sell your personal data to third parties.
          </p>
          <h2 className="text-xl font-bold text-[#0f172a] pt-4">
            3. Security of Your Information
          </h2>
          <p>
            We employ modern encryption and data security measures to protect
            your submitted information against unauthorized access, alteration,
            or disclosure.
          </p>
        </div>
      </Container>
    </div>
  );
}
