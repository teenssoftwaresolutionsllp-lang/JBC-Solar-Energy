export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  image: string;
  rating: number;
  quote: string;
}

export const testimonialsData: TestimonialItem[] = [
  {
    id: "1",
    name: "Ramesh Kumar",
    role: "Homeowner",
    company: "Westlake Residence",
    image: "/images/testimonials/person-1.jpg",
    rating: 5,
    quote: "JBC made going solar effortless. Our electric bill dropped from $380 to $22 per month, and the crew completed installation in just one day.",
  },
  {
    id: "2",
    name: "Suresh Reddy",
    role: "Managing Director",
    company: "Reddy Logistics Hub",
    image: "/images/testimonials/person-2.jpg",
    rating: 5,
    quote: "The 500kW rooftop installation exceeded our expectations. The return on investment and tax incentives transformed our facility's balance sheet.",
  },
  {
    id: "3",
    name: "Raghu Chaitanya",
    role: "Operations VP",
    company: "Apex Tech Campus",
    image: "/images/testimonials/person-3.jpg",
    rating: 5,
    quote: "Professional engineering from day one. Their team handled city permits, utility interconnection, and delivered ahead of schedule.",
  },
  {
    id: "4",
    name: "Ravi Varma",
    role: "Property Developer",
    company: "Hill Country Estates",
    image: "/images/testimonials/person-4.jpg",
    rating: 5,
    quote: "We partnered with JBC for 15 luxury villas. The aesthetics of the all-black panels and their 25-year warranty give buyers supreme confidence.",
  },
];
