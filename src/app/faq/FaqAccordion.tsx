"use client";

import React, { useState } from "react";
import { faqData } from "@/data/faq";
import { siteConfig } from "@/data/site";
import { ChevronDown, HelpCircle, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function FaqAccordion() {
  const [openId, setOpenId] = useState<string | null>("how-installation-works");

  const toggleAccordion = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Accordion list */}
      <div className="space-y-4">
        {faqData.map((item) => {
          const isOpen = openId === item.id;

          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? "bg-white border-[#0070ba]/40 shadow-md ring-1 ring-[#0070ba]/20"
                  : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleAccordion(item.id)}
                className="w-full py-5 px-6 sm:px-7 text-left flex items-center justify-between gap-4 focus:outline-none"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${
                      isOpen ? "bg-[#f36a26]" : "bg-slate-300"
                    }`}
                  />
                  <span className="text-base sm:text-lg font-bold text-[#0f172a]">
                    {item.question}
                  </span>
                </div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-200 flex-shrink-0 ${
                    isOpen
                      ? "bg-sky-50 text-[#0070ba] rotate-180"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-6 sm:px-7 pb-6 pt-1 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100/60 animate-in fade-in duration-200">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still have questions banner */}
      <div className="mt-16 bg-[#f8fafc] rounded-3xl p-8 sm:p-10 border border-slate-200 text-center flex flex-col items-center">
        <div className="w-14 h-14 rounded-full bg-[#eaf5ed] text-[#16a34a] flex items-center justify-center mb-4">
          <HelpCircle className="w-7 h-7" />
        </div>
        <h3 className="text-2xl font-bold text-[#0f172a] mb-2">
          Still Have Questions About Solar?
        </h3>
        <p className="text-sm sm:text-base text-slate-600 max-w-md leading-relaxed mb-6">
          Our solar advisors are ready to walk you through system configurations,
          tax credits, and financing options.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            href="/contact"
            variant="primary"
            size="md"
            className="font-semibold text-sm"
          >
            <span>Request Free Consultation</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
          <a
            href={`tel:${siteConfig.contact.phoneClean}`}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition"
          >
            <Phone className="w-4 h-4 text-[#f36a26]" />
            <span>Call {siteConfig.contact.phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
