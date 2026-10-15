import React from "react";

const benefits = [
  {
    title: "Clean & Renewable",
    description: "100% clean energy for a greener tomorrow.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 2a10 10 0 0 1 0 20A10 10 0 0 1 12 2z" />
        <path d="M12 6v6l4 2" />
        <path d="M7 14s1 2 5 2 5-2 5-2" />
        <path d="M8 10c0-2.2 1.8-4 4-4" />
      </svg>
    ),
  },
  {
    title: "Cost Savings",
    description: "Reduce your electricity bills significantly.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v2m0 8v2m-4-5h2a2 2 0 0 0 0-4H9a2 2 0 0 1 0-4h6m-3-1v1m0 8v1" />
      </svg>
    ),
  },
  {
    title: "Reliable & Durable",
    description: "High Performance for 25+ years.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  {
    title: "Expert Support",
    description: "From consultation to maintenance.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="12" cy="8" r="4" />
        <path d="M6 20v-2a6 6 0 0 1 12 0v2" />
        <path d="M19 8a7 7 0 0 0-14 0" />
      </svg>
    ),
  },
];

export function Benefits() {
  return (
    <section className="py-10 bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-7 flex flex-col items-center text-center shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              {/* Mint green circle */}
              <div className="w-14 h-14 rounded-full bg-[#edf7ee] border border-[#d0eed4] flex items-center justify-center text-[#22c55e] mb-5">
                {b.icon}
              </div>
              <h3 className="text-sm font-bold text-[#0f172a] mb-2">{b.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
