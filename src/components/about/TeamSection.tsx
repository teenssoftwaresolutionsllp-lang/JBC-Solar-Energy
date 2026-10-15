import React from "react";
import Image from "next/image";

const teamMembers = [
  {
    name: "Mr. Jamta Ram",
    role: "Founder & CEO, JBC Solar Energy",
    bio: "With over 5 years of experience in the solar energy industry, Mr. Jamta Ram is committed to delivering reliable, efficient, and sustainable solar solutions. His vision is to empower homes, businesses, and industries with smarter energy choices, building lasting customer trust while creating a cleaner, brighter future for generations to come.",
    image: "/images/team/chetan-kumar.png",

  },
  {
    name: "Mr. Chetan Kumar",
    role: "Managing Director (MD), JBC Solar Energy",
    bio: "As Managing Director of JBC, I focus on driving sustainable business growth, building customer trust, and delivering reliable solar energy solutions. My vision is to make JBC a trusted name in the solar industry through innovation, quality, and long-term customer satisfaction.",
    image: "/images/team/jamta-ram.png",
  },
  {
    name: "Mr. Vishnu Choudhary",
    role: "Chief Technology Officer (CTO), JBC Solar Energy",
    bio: "Driving technological innovation and advanced solar solutions to ensure superior quality, operational efficiency, and sustainable business growth at JBC.",
    image: "/images/team/vishnu-choudhary.png",
  },
];

export function TeamSection() {
  return (
    <section className="py-14 md:py-20 bg-white" id="team">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section label — orange uppercase small text */}
        <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#f36a26] mb-3">
          OUR TEAM
        </p>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] tracking-tight mb-3">
          Meet Our Experts
        </h2>

        <p className="text-sm sm:text-base text-slate-500 mb-10 max-w-xl leading-relaxed">
          Our team of professionals brings years of experience, industry knowledge and a shared passion for clean energy.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <article
              key={member.name}
              className="overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-[4/3] bg-slate-100">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top"
                />
              </div>
              <div className="p-6 sm:p-8">
                <h3 className="text-xl font-bold text-[#0f172a]">{member.name}</h3>
                <p className="text-sm font-semibold text-[#f36a26] mt-1">{member.role}</p>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed mt-4">
                  {member.bio}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
