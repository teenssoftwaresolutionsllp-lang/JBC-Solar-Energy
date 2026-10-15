import React from "react";
import Image from "next/image";

// Icons aligned with each benefit statement
const QualityIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M12 2l2.7 5.4 5.9.9-4.3 4.2 1 5.9-5.3-2.8-5.3 2.8 1-5.9L3.4 8.3l5.9-.9L12 2z" />
  </svg>
);
const InstallationIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M14 3l7 7-9 9-7-7 9-9z" />
    <path d="M13 6l5 5" />
    <path d="M4 14l6 6" />
  </svg>
);
const ServiceIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M5 7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7z" />
    <path d="M8 11h8M8 15h5" />
  </svg>
);
const ProcessIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M2 12h4l2-7 4 14 2-7h8" />
  </svg>
);
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M12 3l7 3v6c0 4.4-2.8 8.5-7 10-4.2-1.5-7-5.6-7-10V6l7-3z" />
    <path d="M9.5 12.5l1.5 1.5 3.5-4" />
  </svg>
);
const SupportIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M4 12a8 8 0 0 1 16 0v4a2 2 0 0 1-2 2h-2v-6h4" />
    <path d="M4 16a2 2 0 0 0 2 2h2v-6H4" />
    <path d="M8 16v2M16 16v2" />
  </svg>
);

const iconBg = "w-14 h-14 rounded-full bg-[#edf7ee] border border-[#d0eed4] flex items-center justify-center text-[#22c55e] mb-4";

export function WhyJBC() {
  return (
    <section className="py-12 md:py-16 bg-white" id="why-jbc">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] text-center tracking-tight mb-10">
          Why Choose JBC Solar?
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
          <div className="lg:col-span-3 bg-white rounded-xl p-7 border border-slate-200 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className={iconBg}><QualityIcon /></div>
            <h3 className="text-sm font-bold text-[#0f172a] mb-2">Premium Quality</h3>
            <p className="text-xs text-slate-500 leading-relaxed">High-quality solar components selected for long-term performance.</p>
          </div>

          <div className="lg:col-span-6 relative min-h-[200px] lg:min-h-[240px] rounded-xl overflow-hidden shadow-sm border border-slate-200">
            <Image
              src="/images/image 9.png"
              alt="Solar panels at mountain sunset"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>

          <div className="lg:col-span-3 bg-white rounded-xl p-7 border border-slate-200 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className={iconBg}><InstallationIcon /></div>
            <h3 className="text-sm font-bold text-[#0f172a] mb-2">Expert Installation</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Professional installation by trained solar technicians.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className={iconBg}><ServiceIcon /></div>
            <h3 className="text-sm font-bold text-[#0f172a] mb-2">End-to-End Service</h3>
            <p className="text-xs text-slate-500 leading-relaxed">From consultation and design to installation and monitoring.</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className={iconBg}><ProcessIcon /></div>
            <h3 className="text-sm font-bold text-[#0f172a] mb-2">Transparent Process</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Clear communication, transparent pricing, and no unnecessary surprises.</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className={iconBg}><ShieldIcon /></div>
            <h3 className="text-sm font-bold text-[#0f172a] mb-2">Warranty Protection</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Reliable product and installation warranty support.</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className={iconBg}><SupportIcon /></div>
            <h3 className="text-sm font-bold text-[#0f172a] mb-2">After-Sales Support</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Ongoing maintenance and technical assistance after installation.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
