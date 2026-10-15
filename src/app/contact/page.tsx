import React from "react";
import { ContactHero } from "@/components/contact/ContactHero";
import { ConsultationForm } from "@/components/contact/ConsultationForm";
import { ContactMap } from "@/components/contact/ContactMap";

export const metadata = {
  title: "Contact Us | JBC Solar Energy",
  description:
    "Get in touch with JBC Solar Energy. Request a clear, no-pressure solar assessment for residential, commercial, or industrial properties.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col w-full">
      <ContactHero />
      <ConsultationForm />
      <ContactMap />
    </div>
  );
}
