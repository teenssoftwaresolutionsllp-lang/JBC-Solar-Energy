import React from "react";

const stats = [
  { value: "1200+", label: "Happy Customers" },
  { value: "50+ MW", label: "Total Installed Capacity" },
  { value: "300+", label: "Projects Completed" },
  { value: "5+", label: "Years of Experience" },
];

export function ImpactSection() {
  return (
    <section className="py-12 md:py-16 bg-white" id="impact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* GREEN label */}
        <p className="text-sm font-bold text-[#22c55e] mb-2">Our Impact</p>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] mb-10">
          Making a Brighter Tomorrow
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <span className="text-4xl sm:text-5xl font-black text-[#0f172a] tracking-tight">
                {stat.value}
              </span>
              <span className="mt-2 text-sm font-medium text-slate-500">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
