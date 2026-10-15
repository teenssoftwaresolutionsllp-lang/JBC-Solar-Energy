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
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-full border border-neutral-600 flex items-center justify-center text-neutral-300 hover:border-white hover:text-white transition-colors"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
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
          </div>
        </div>
      </div>
    </footer>
  );
}
