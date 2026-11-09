import { siteConfig } from "@/data/site";

const companyAddress = siteConfig.contact.locations[1].address;
const encodedAddress = encodeURIComponent(companyAddress);
const mapUrl =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.7483186457694!2d78.47002319678958!3d17.3758396!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9780286ea75f%3A0x3607f206bde44dd0!2sRavi%20embroidery!5e0!3m2!1sen!2sin!4v1794200000764!5m2!1sen!2sin";
const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

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
              JBC Solar Energy - Hyderabad
            </h2>
          </div>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-[#f36a26] transition-colors hover:text-[#e05514]"
          >
            Open in Google Maps
          </a>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <iframe
            title="Google Maps location for JBC Solar Energy in Hyderabad"
            src={mapUrl}
            aria-hidden="true"
            className="pointer-events-none h-[320px] w-full sm:h-[420px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open JBC Solar Energy's Hyderabad location in Google Maps"
            className="absolute inset-0"
          />
        </div>
      </div>
    </section>
  );
}
