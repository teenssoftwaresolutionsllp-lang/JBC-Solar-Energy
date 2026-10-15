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
    whatsapp: "9100024222",
    locations: [
      {
        label: "Company address",
        address:
          "215, Chaudhriyo Ka Bas, Ward No 1, Main Road Kora, Bhinmal, Jalor, Rajasthan, 343029, India",
      },
      {
        label: "Other office",
        address: "Raj Bhavan Road, Somajiguda, Hyderabad, Telangana (500082)",
      },
    ],
    legalName: "JBC RENEWABLE ENERGY INDIA LIMITED",
    cin: "U35105RJ2026PLC111882",
  },
  social: {
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
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
