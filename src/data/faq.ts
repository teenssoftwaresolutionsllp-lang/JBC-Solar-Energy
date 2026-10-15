export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "General" | "Residential" | "Commercial" | "Installation";
}

export const faqData: FAQItem[] = [
  {
    id: "how-installation-works",
    question: "How does solar installation work?",
    answer: "Our streamlined 5-step process takes care of everything from start to finish: Initial Consultation, Comprehensive Site Survey, Custom Engineering & Permitting, Certified Rooftop Installation, and 24/7 Remote Monitoring with utility interconnection.",
    category: "General",
  },
  {
    id: "how-much-save",
    question: "How much can I save with solar?",
    answer: "Most homeowners and businesses eliminate 70% to 90% of their electricity bill. In addition, federal tax credits (ITC 30%), local utility rebates, and accelerated depreciation significantly accelerate your payback period to typically 4 to 7 years.",
    category: "General",
  },
  {
    id: "how-long-installation",
    question: "How long does installation take?",
    answer: "The physical rooftop installation typically takes only 1 to 2 days for residential properties and 1 to 3 weeks for commercial sites. Permitting and utility interconnect approvals usually take 2 to 4 weeks depending on your city municipality.",
    category: "Installation",
  },
  {
    id: "maintenance-support",
    question: "Do you provide maintenance and monitoring?",
    answer: "Yes! Every JBC system includes 24/7 proactive monitoring through our operations center and our dedicated mobile app. We offer scheduled thermal inspections, panel cleaning, and emergency technical dispatch.",
    category: "General",
  },
  {
    id: "commercial-viability",
    question: "Can solar work for commercial buildings?",
    answer: "Absolutely. Flat roofs, sloped metal roofs, parking structures, and adjacent ground lots are ideal for commercial solar. It provides massive hedge against escalating utility tariffs and delivers tangible ESG sustainability metrics.",
    category: "Commercial",
  },
  {
    id: "panel-lifespan",
    question: "How long do solar panels last?",
    answer: "Our Tier-1 monocrystalline panels carry a 25-year manufacturer production warranty and are engineered to perform efficiently for 30 to 40+ years with minimal degradation (typically less than 0.5% per year).",
    category: "General",
  },
  {
    id: "cloudy-days",
    question: "What happens on cloudy days or during grid blackouts?",
    answer: "Solar panels continue generating power from ambient and diffused sunlight even on overcast days. For grid outages, pairing your solar system with our smart battery storage keeps your critical circuits powered seamlessly.",
    category: "Residential",
  },
];
