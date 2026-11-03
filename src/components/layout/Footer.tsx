import React from "react";
import Link from "next/link";
import { siteConfig } from "@/data/site";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-[#1b1008] text-neutral-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-14 border-b border-[#362314]">
          {/* Col 1: Brand & Bio (2 cols wide on desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <Logo />
            <p className="text-xs sm:text-sm text-neutral-300 max-w-sm leading-relaxed pt-2">
              Smart solar solutions, professionally delivered. Powering homes and businesses toward a cleaner future.
            </p>

            {/* Social media links */}
            <div className="flex items-center gap-3 pt-3">
              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent("Hello, I would like to know more about your solar energy solutions.")}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-8 h-8 rounded-full border border-neutral-600 flex items-center justify-center text-neutral-300 hover:border-white hover:text-white transition-colors"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full border border-neutral-600 flex items-center justify-center text-neutral-300 hover:border-white hover:text-white transition-colors"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r=".75" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full border border-neutral-600 flex items-center justify-center text-neutral-300 hover:border-white hover:text-white transition-colors"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2V7.5c0-.9.3-1.5 1.6-1.5h1.7V3.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.3v3.2h2.8V21h3.4z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Quick links */}
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-white tracking-wide mb-4">
              Quick links
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-300">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-white transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/#why-jbc" className="hover:text-white transition-colors">
                  Why JBC
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Solar solutions */}
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-white tracking-wide mb-4">
              Solar solutions
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-300">
              <li>
                <Link href="/solutions#residential" className="hover:text-white transition-colors">
                  Residential solar
                </Link>
              </li>
              <li>
                <Link href="/solutions#commercial" className="hover:text-white transition-colors">
                  Commercial solar
                </Link>
              </li>
              <li>
                <Link href="/solutions#industrial" className="hover:text-white transition-colors">
                  Industrial solar
                </Link>
              </li>
              <li>
                <Link href="/solutions" className="hover:text-white transition-colors">
                  Installation
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-white tracking-wide mb-4">
              Contact
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-neutral-300">
              {siteConfig.contact.locations.map((location) => (
                <p key={location.label}>
                  <span className="font-semibold text-white">{location.label}:</span>{" "}
                  {location.address}
                </p>
              ))}
              <p>
                <a href={`tel:${siteConfig.contact.phoneClean}`} className="hover:text-white transition-colors">
                  Phone: {siteConfig.contact.phone}
                </a>
              </p>
              <p>
                <a href={`https://wa.me/${siteConfig.contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  WhatsApp: {siteConfig.contact.phone}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs text-neutral-400 gap-3">
          <div className="text-center sm:text-left">
            <p>© 2026 JBC Solar. All rights reserved.</p>
            <p className="mt-1">
              {siteConfig.contact.legalName} · CIN: {siteConfig.contact.cin}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            {/* <Link href="/admin/login" className="text-amber-400 hover:text-amber-300 font-medium transition-colors flex items-center gap-1">
            <span>Admin Portal</span>
           </Link> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
