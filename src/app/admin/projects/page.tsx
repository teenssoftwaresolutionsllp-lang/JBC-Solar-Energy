"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  PlusCircle,
  Search,
  Zap,
  MapPin,
  Calendar,
  Building,
  Edit2,
  Trash2,
  Loader2,
  RefreshCw,
  SunMedium,
} from "lucide-react";
import { SolarProjectRecord } from "@/lib/admin-types";
import { ProjectModal } from "@/components/admin/ProjectModal";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<SolarProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<SolarProjectRecord | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error("Fetch projects error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDelete = async (project: SolarProjectRecord) => {
    if (!confirm(`Are you sure you want to delete solar project "${project.title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/projects/${project.id}`, { method: "DELETE" });
      if (res.ok) {
        fetchProjects();
      }
    } catch (err) {
      console.error("Delete project error:", err);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesCat = categoryFilter === "All" || p.category === categoryFilter;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-slate-900/80 p-6 border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <SunMedium className="h-6 w-6 text-amber-400" />
            Solar Portfolio & Installations Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Showcase commissioned residential rooftop arrays, commercial microgrids, and industrial captive plants.
          </p>
        </div>

        <button
          onClick={() => {
            setProjectToEdit(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#f36a26] to-[#e05514] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-500/20 hover:brightness-110 active:scale-95 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add Solar Project</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, location, or client name..."
            className="w-full rounded-xl border border-slate-700/80 bg-slate-950 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-[#f36a26] focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-300 focus:border-[#f36a26] focus:outline-hidden"
          >
            <option value="All">All Categories</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Industrial">Industrial</option>
          </select>

          <button
            onClick={fetchProjects}
            title="Refresh projects"
            className="rounded-xl border border-slate-700 bg-slate-950 p-2 text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading && projects.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin text-[#f36a26] mx-auto mb-2" />
            <span>Loading solar portfolio...</span>
          </div>
        ) : filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg backdrop-blur-md flex flex-col justify-between hover:border-slate-700 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`rounded-lg px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      project.category === "Residential"
                        ? "bg-[#f36a26]/10 text-[#f36a26] border border-[#f36a26]/20"
                        : project.category === "Commercial"
                        ? "bg-[#0070ba]/10 text-[#0070ba] border border-[#0070ba]/20"
                        : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                    }`}
                  >
                    {project.category}
                  </span>
                  <span className="text-xs font-bold text-amber-400 font-mono flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    {project.capacity}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors leading-snug">
                  {project.title}
                </h3>

                <div className="mt-3 space-y-1.5 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Building className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <span>{project.client}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <span>Commissioned: {project.completionYear}</span>
                  </div>
                </div>

                {project.impact && (
                  <p className="mt-3 text-[11px] text-emerald-400/90 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2 leading-relaxed">
                    🌱 {project.impact}
                  </p>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    setProjectToEdit(project);
                    setIsModalOpen(true);
                  }}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Edit project"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(project)}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/20 transition-colors"
                  title="Delete project"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center text-slate-500">
            No solar installations found.
          </div>
        )}
      </div>

      <ProjectModal
        isOpen={isModalOpen}
        project={projectToEdit}
        onClose={() => {
          setIsModalOpen(false);
          setProjectToEdit(null);
        }}
        onSuccess={fetchProjects}
      />
    </div>
  );
}
