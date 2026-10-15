"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { projectsData, ProjectItem } from "@/data/projects";
import { Zap, MapPin, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ProjectsGallery() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Residential", "Commercial", "Industrial"];

  const filteredProjects =
    activeCategory === "All"
      ? projectsData
      : projectsData.filter((p) => p.category === activeCategory);

  return (
    <div className="w-full">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 mb-14">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
              activeCategory === cat
                ? "bg-[#0f172a] text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
            }`}
          >
            {cat} Projects
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
          >
            {/* Project Image */}
            <div className="relative h-64 w-full overflow-hidden bg-slate-900">
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-[#f36a26] shadow-sm uppercase tracking-wider">
                {project.category}
              </div>
              <div className="absolute bottom-4 right-4 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white shadow flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>{project.capacity}</span>
              </div>
            </div>

            {/* Project Content */}
            <div className="p-7 flex flex-col flex-1 justify-between">
              <div>
                <div className="flex items-center text-xs text-slate-400 mb-2 gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#f36a26]" />
                  <span>{project.location}</span>
                  <span className="mx-1">•</span>
                  <span>Completed {project.completionYear}</span>
                </div>

                <h3 className="text-xl font-bold text-[#0f172a] tracking-tight mb-3 group-hover:text-[#0070ba] transition-colors">
                  {project.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {project.description}
                </p>

                <div className="p-3 rounded-xl bg-[#eaf5ed] border border-[#d2ecd7] flex items-center gap-2 text-xs font-semibold text-[#16a34a] mb-6">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{project.impact}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href="/contact"
                  className="inline-flex items-center text-xs font-bold text-[#f36a26] group-hover:text-[#e05514] transition-colors"
                >
                  <span>Inquire About Similar Project</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
