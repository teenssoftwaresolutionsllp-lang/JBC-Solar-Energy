export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

export const teamData: TeamMember[] = [
  {
    id: "1",
    name: "Marcus Vance",
    role: "Chief Executive Officer & Founder",
    bio: "15+ years leading clean energy infrastructure initiatives across North America.",
    image: "/images/team/team-2.jpg",
  },
  {
    id: "2",
    name: "Dr. Elena Rostova",
    role: "VP of Engineering & Solar Architecture",
    bio: "Ph.D. in Photovoltaic Systems, specialized in high-efficiency commercial microgrids.",
    image: "/images/team/team-1.jpg",
  },
  {
    id: "3",
    name: "David Chen, PE",
    role: "Director of Field Operations",
    bio: "Licensed Professional Engineer overseeing 300+ rooftop and ground-mount installations.",
    image: "/images/testimonials/person-3.jpg",
  },
  {
    id: "4",
    name: "Sarah Jenkins",
    role: "Head of Client Solutions & Assessment",
    bio: "Dedicated to providing transparent, pressure-free financial models for property owners.",
    image: "/images/team/team-3.jpg",
  },
];
