export interface SolutionItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  features: string[];
  specs: { label: string; value: string }[];
}

export const solutionsData: SolutionItem[] = [
  {
    id: "residential",
    title: "Residential Solar",
    subtitle: "Clean Energy for Modern Homes",
    description: "Power your home with clean,reliable,and affordable energy",
    image: "/images/image 6.png",
    features: [
      "Custom rooftop designs tailored to architectural aesthetics",
      "Tier-1 monocrystalline high-efficiency panels",
      "Seamless home battery storage integration",
      "Real-time mobile app energy monitoring",
      "25-year comprehensive equipment and production warranty",
    ],
    specs: [
      { label: "Typical System Size", value: "6 kW – 16 kW" },
      { label: "Average Bill Offset", value: "Up to 90%" },
      { label: "Warranty", value: "25 Years" },
      { label: "Payback Period", value: "5 – 7 Years" },
    ],
  },
  {
    id: "commercial",
    title: "Commercial Solar",
    subtitle: "Smarter Energy for Modern Enterprises",
    description: "Reduce operating costs with reliable solar solutions designed for businesses.",
    image: "/images/image 7.png",
    features: [
      "Zero-downtime installation engineered for commercial continuity",
      "Aggressive tax incentives & accelerated MACRS depreciation",
      "Advanced commercial inverters with remote string monitoring",
      "Carport solar canopies with integrated EV fast chargers",
      "Dedicated commercial asset management & SLA support",
    ],
    specs: [
      { label: "Typical System Size", value: "50 kW – 500 kW" },
      { label: "Operating Cost Reduction", value: "40% – 70%" },
      { label: "Tax Credit (ITC)", value: "Up to 30%+" },
      { label: "Monitoring", value: "24/7 Operations Center" },
    ],
  },
  {
    id: "industrial",
    title: "Industrial Solar",
    subtitle: "Megawatt-Scale Energy Independence",
    description: " Improve energy efficiency and reduce operating costs with scalable industrial solar systems.",
    image: "/images/image 9.png",
    features: [
      "Utility interconnection engineering and high-voltage substation tie-ins",
      "Heavy-duty ballasted and ground-mount engineered racking",
      "Peak-demand shaving with multi-megawatt BESS (battery systems)",
      "Automated SCADA grid compliance and weather station integration",
      "Performance guarantees backed by Tier-1 EPC standards",
    ],
    specs: [
      { label: "Typical System Size", value: "500 kW – 10+ MW" },
      { label: "Peak Shaving", value: "Up to 50% Demand Charge Cut" },
      { label: "Grid Interconnection", value: "Medium / High Voltage" },
      { label: "Performance Ratio", value: "> 82% Guaranteed" },
    ],
  },
];
