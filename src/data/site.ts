export interface NavItem {
  label: string;
  href: string;
}

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Solutions", href: "/solutions" },
  { label: "Projects", href: "/projects" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export const siteConfig = {
  name: "JBC Solar Energy",
  shortName: "JBC",
  tagline: "Powering a Brighter Tomorrow",
  description:
    "Smart solar solutions, professionally delivered. Powering homes and businesses toward a cleaner, more sustainable future.",
  contact: {
    phone: "+91 9100024222",
    phoneClean: "9100024222",
    whatsapp: "919100024222",
    locations: [
      {
        label: "Company address",
        address: "Bhinmal, Jalore, Rajasthan, 343029 ,India",
      },
      {
        label: "Other office",
        address:
          "15-8-3, G-6 , Tolaram Building, Near Siddiamber Bazar Masjid Hyderabad , Telangana 500012",
      },
    ],
    legalName: "JBC RENEWABLE ENERGY INDIA LIMITED",
    cin: "U35105RJ2026PLC111882",
    openingHours: "Monday to Saturday: 9:00 AM - 6:00 PM | Sunday: Closed",
  },
  social: {
    linkedin: "https://linkedin.com",
    instagram: "https://www.instagram.com/jbcsolarenergypvt.ltd",
    facebook: "https://facebook.com",
    twitter: "https://x.com",
  },
  stats: [
    { value: "1200+", label: "Happy Customers" },
    { value: "50+ MW", label: "Total Installed Capacity" },
    { value: "300+", label: "Projects Completed" },
    { value: "5+", label: "Years of Experience" },
  ],
};
