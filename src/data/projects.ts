export interface ProjectItem {
  id: string;
  title: string;
  category: "Residential" | "Commercial" | "Industrial";
  capacity: string;
  location: string;
  completionYear: string;
  image: string;
  description: string;
  impact: string;
}

export const projectsData: ProjectItem[] = [
  {
    id: "horizon-logistics",
    title: "500kW Rooftop Array for Horizon Logistics Center",
    category: "Commercial",
    capacity: "500 kW",
    location: "Austin, TX",
    completionYear: "2025",
    image: "/images/image 7.png",
    description: " Make the most of your available roof space with a professionally designed solar system.",
    impact: "Eliminates 460 metric tons of CO2 annually",
  },
  {
    id: "austin-hills-residence",
    title: "Hill Country Net-Zero Residential Sanctuary",
    category: "Residential",
    capacity: "14.8 kW + 20kWh Battery",
    location: "Westlake Hills, TX",
    completionYear: "2025",
    image: "/images/image 6.png",
    description: "Architecturally integrated all-black monocrystalline system with full whole-home backup battery bank.",
    impact: "100% grid independence with net metering surplus",
  },
  {
    id: "lonestar-advanced-manufacturing",
    title: "1.8MW Industrial Microgrid & Solar Farm",
    category: "Industrial",
    capacity: "1.8 MW",
    location: "San Antonio, TX",
    completionYear: "2024",
    image: "/images/image 17.png",
    description: "High-voltage interconnected manufacturing solar microgrid providing continuous peak shaving and operational resilience.",
    impact: "Saves $240,000 annually in demand charges",
  },
  {
    id: "oak-ridge-commercial-plaza",
    title: "Corporate Campus Carport & Solar Canopy",
    category: "Commercial",
    capacity: "350 kW",
    location: "Round Rock, TX",
    completionYear: "2025",
    image: "/images/image 8.png",
    description: "Dual-purpose solar carport covering 180 parking bays with 12 integrated Level 2 EV charging stations.",
    impact: "Powers 65% of campus HVAC and office computing",
  },
  {
    id: "travis-county-agri-solar",
    title: "Dual-Use Agricultural Solar Installation",
    category: "Industrial",
    capacity: "850 kW",
    location: "Del Valle, TX",
    completionYear: "2024",
    image: "/images/image 9.png",
    description: "Elevated racking structure enabling grazing and shade-tolerant crop farming underneath solar arrays.",
    impact: "Dual revenue stream with clean irrigation power",
  },
  {
    id: "sol-vista-subdivision",
    title: "Eco-District 24-Home Community Solar Array",
    category: "Residential",
    capacity: "192 kW Total",
    location: "Dripping Springs, TX",
    completionYear: "2025",
    image: "/images/image 11.png",
    description: "Turnkey residential rooftop deployment for a master-planned net-zero neighborhood.",
    impact: "Clean energy for 24 high-efficiency family homes",
  },
];
