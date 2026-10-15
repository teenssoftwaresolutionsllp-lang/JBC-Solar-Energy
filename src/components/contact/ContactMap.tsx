import { siteConfig } from "@/data/site";

const companyAddress = siteConfig.contact.locations[0].address;
const encodedAddress = encodeURIComponent(companyAddress);
const mapUrl = `https://maps.google.com/maps?q=${encodedAddress}&output=embed`;

export function ContactMap() {
  return (
    <section
      aria-labelledby="contact-map-title"
      className="bg-slate-50 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#f36a26]">
              Visit us
            </p>
            <h2
              id="contact-map-title"
              className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl"
            >
              JBC Solar Energy - Bhinmal
            </h2>
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-[#f36a26] transition-colors hover:text-[#e05514]"
          >
            Open in Google Maps
          </a>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <iframe
            title="Google Maps location for JBC Solar Energy in Bhinmal"
            src={mapUrl}
            className="h-[320px] w-full sm:h-[420px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
