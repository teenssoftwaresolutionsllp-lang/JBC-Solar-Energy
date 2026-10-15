"use client";

import React, { useState } from "react";
import { Phone, MessageCircle, MapPin, ArrowRight, ShieldCheck, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { siteConfig } from "@/data/site";
import { consultationFormSchema } from "@/lib/validations";

export function ConsultationForm() {
  const propertyTypeOptions = ["Residential", "Commercial", "Industrial"];
  const interestOptions = ["Rooftop Solar", "Solar EPC", "Battery Storage", "Maintenance", "Other"];
  const billOptions = [
    "Below ₹5,000",
    "₹5,000 - ₹10,000",
    "₹10,000 - ₹15,000",
    "₹15,000 - ₹20,000",
    "₹20,000+",
  ];

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    location: "",
    propertyType: "",
    interestedIn: "",
    averageElectricityBill: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const validation = consultationFormSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Submission failed.");
      setIsSuccess(true);
      setFormData({ fullName: "", phone: "", email: "", location: "", propertyType: "", interestedIn: "", averageElectricityBill: "", message: "" });
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-2.5 rounded-xl border bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#f36a26] transition-all ${errors[field] ? "border-red-400" : "border-slate-300"}`;

  return (
    <section className="py-14 md:py-20 bg-white" id="assessment">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* ── Left: LET'S TALK SOLAR (5 cols) ── */}
          <div className="lg:col-span-5">
            {/* Orange dash + label */}
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-[3px] bg-[#f36a26] rounded-full inline-block" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#f36a26]">
                LET&apos;S TALK SOLAR
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] tracking-tight leading-tight mb-4">
              Get Your Free Solar Assessment
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-10">
              Tell us a little about your property. A JBC solar specialist will review your details and call you within one business day.
            </p>

            {/* Contact info items */}
            <div className="space-y-6">
              {/* Call us */}
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Call us</div>
                  <a href={`tel:${siteConfig.contact.phoneClean}`} className="text-sm font-semibold text-slate-900 hover:text-[#f36a26] transition-colors">
                    {siteConfig.contact.phone}
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">WhatsApp</div>
                  <a href={`https://wa.me/${siteConfig.contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-slate-900 hover:text-[#f36a26] transition-colors">
                    {siteConfig.contact.phone}
                  </a>
                </div>
              </div>

              {siteConfig.contact.locations.map((location) => (
                <div key={location.label} className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                      {location.label}
                    </div>
                    <div className="text-sm font-semibold text-slate-900">
                      {location.address}
                    </div>
                  </div>
                </div>
              ))}
              <div className="border-t border-slate-200 pt-5 text-xs text-slate-500">
                <p className="font-semibold text-slate-700">{siteConfig.contact.legalName}</p>
                <p className="mt-1">CIN: {siteConfig.contact.cin}</p>
              </div>
            </div>
          </div>

          {/* ── Right: Request Form Card (7 cols) ── */}
          <div className="lg:col-span-7 bg-[#f8fafc] rounded-3xl border border-slate-200 p-7 sm:p-9 shadow-sm">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0f172a] mb-1">
              Get Your Free Solar Assessment
            </h3>
            <p className="text-sm text-slate-500 mb-7">No obligation. Just clear, expert advice.</p>

            {serverError && (
              <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{serverError}</span>
              </div>
            )}

            {isSuccess ? (
              <div className="py-10 px-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center flex flex-col items-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mb-3" />
                <h4 className="text-lg font-bold text-slate-900 mb-2">Consultation Request Received!</h4>
                <p className="text-slate-600 text-sm leading-relaxed mb-5 max-w-xs">
                  A solar specialist will review your details and contact you within 24 hours.
                </p>
                <button onClick={() => setIsSuccess(false)} className="px-6 py-2 bg-slate-900 text-white rounded-full text-sm font-semibold hover:bg-slate-800 transition">
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fullName" className="block text-xs font-semibold text-slate-600 mb-1.5">Full Name</label>
                    <input id="fullName" type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Your name" className={inputClass("fullName")} />
                    {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-xs font-semibold text-slate-600 mb-1.5">Phone / WhatsApp</label>
                    <input id="phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 000 000 0000" className={inputClass("phone")} />
                    {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-slate-600 mb-1.5">Email Address</label>
                    <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@email.com" className={inputClass("email")} />
                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-xs font-semibold text-slate-600 mb-1.5">City / Location</label>
                    <input id="location" type="text" name="location" value={formData.location} onChange={handleChange} placeholder="City or ZIP code" className={inputClass("location")} />
                    {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="propertyType" className="block text-xs font-semibold text-slate-600 mb-1.5">Property Type</label>
                  <select id="propertyType" name="propertyType" value={formData.propertyType} onChange={handleChange} className={inputClass("propertyType")}>
                    <option value="">Select type</option>
                    {propertyTypeOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  {errors.propertyType && <p className="mt-1 text-xs text-red-600">{errors.propertyType}</p>}
                </div>

                <div>
                  <label htmlFor="interestedIn" className="block text-xs font-semibold text-slate-600 mb-1.5">Interested In</label>
                  <select id="interestedIn" name="interestedIn" value={formData.interestedIn} onChange={handleChange} className={inputClass("interestedIn")}>
                    <option value="">Select service</option>
                    {interestOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  {errors.interestedIn && <p className="mt-1 text-xs text-red-600">{errors.interestedIn}</p>}
                </div>

                <div>
                  <label htmlFor="averageElectricityBill" className="block text-xs font-semibold text-slate-600 mb-1.5">Average Monthly Electricity Bill</label>
                  <select id="averageElectricityBill" name="averageElectricityBill" value={formData.averageElectricityBill} onChange={handleChange} className={inputClass("averageElectricityBill")}>
                    <option value="">Select range</option>
                    {billOptions.map((option) => (
                      <option key={option} value={option}>{option} / month</option>
                    ))}
                  </select>
                  {errors.averageElectricityBill && <p className="mt-1 text-xs text-red-600">{errors.averageElectricityBill}</p>}
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-semibold text-slate-600 mb-1.5">How Can We Help?</label>
                  <textarea id="message" name="message" rows={4} value={formData.message} onChange={handleChange} placeholder="Tell us about your energy goals" className={inputClass("message")} />
                  {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#f36a26] hover:bg-[#e05514] text-white font-semibold text-base flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#f36a26] focus:ring-offset-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /><span>Submitting...</span></>
                  ) : (
                    <><span>Get My Free Solar Quote</span><ArrowRight className="w-4 h-4" /></>
                  )}
                </button>

                <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400 pt-1">
                  <ShieldCheck className="w-4 h-4" />
                  Your information is private and secure.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
