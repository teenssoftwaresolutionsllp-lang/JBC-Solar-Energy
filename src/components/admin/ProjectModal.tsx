"use client";

import React, { useState, useEffect } from "react";
import { X, SunMedium, Loader2, AlertCircle } from "lucide-react";
import { SolarProjectRecord } from "@/lib/admin-types";

interface ProjectModalProps {
  isOpen: boolean;
  project?: SolarProjectRecord | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProjectModal({ isOpen, project, onClose, onSuccess }: ProjectModalProps) {
  const isEditing = !!project;

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<"Residential" | "Commercial" | "Industrial">("Commercial");
  const [capacity, setCapacity] = useState("");
  const [location, setLocation] = useState("");
  const [client, setClient] = useState("");
  const [completionYear, setCompletionYear] = useState(new Date().getFullYear().toString());
  const [status, setStatus] = useState<"Completed" | "Ongoing" | "Planning">("Completed");
  const [image, setImage] = useState("/images/image 7.png");
  const [description, setDescription] = useState("");
  const [impact, setImpact] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setCategory(project.category);
      setCapacity(project.capacity);
      setLocation(project.location);
      setClient(project.client);
      setCompletionYear(project.completionYear);
      setStatus(project.status);
      setImage(project.image);
      setDescription(project.description);
      setImpact(project.impact || "");
    } else {
      setTitle("");
      setCategory("Commercial");
      setCapacity("");
      setLocation("");
      setClient("");
      setCompletionYear(new Date().getFullYear().toString());
      setStatus("Completed");
      setImage("/images/image 7.png");
      setDescription("");
      setImpact("");
    }
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !capacity.trim() || !location.trim()) {
      setError("Title, capacity, and location are required.");
      return;
    }

    setLoading(true);
    try {
      const url = isEditing
        ? `/api/admin/projects/${project.id}`
        : "/api/admin/projects";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          category,
          capacity: capacity.trim(),
          location: location.trim(),
          client: client.trim() || "Private Client",
          completionYear,
          status,
          image,
          description: description.trim() || "High-efficiency turnkey solar installation.",
          impact: impact.trim() || "Clean renewable power generation.",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to save project.");
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0f172a] border border-slate-700/80 shadow-2xl p-6 text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <SunMedium className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {isEditing ? "Edit Solar Project" : "Add Solar Project to Portfolio"}
              </h2>
              <p className="text-xs text-slate-300">
                Showcase completed installations on the public projects gallery.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Project Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 500kW Rooftop Array for Horizon Logistics"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-[#f36a26] focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as "Residential" | "Commercial" | "Industrial")}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-[#f36a26] focus:outline-hidden"
              >
                <option value="Commercial">Commercial</option>
                <option value="Residential">Residential</option>
                <option value="Industrial">Industrial</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Installed Capacity *
              </label>
              <input
                type="text"
                required
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="e.g. 500 kW / 14.8 kW"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-[#f36a26] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Year Completed
              </label>
              <input
                type="text"
                value={completionYear}
                onChange={(e) => setCompletionYear(e.target.value)}
                placeholder="2025"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-[#f36a26] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Location *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Hyderabad, Telangana"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-[#f36a26] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Client / Institution
              </label>
              <input
                type="text"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="e.g. Horizon Logistics Center"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-[#f36a26] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Project Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Architecturally integrated solar system with smart export net-metering."
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-[#f36a26] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Environmental / Economic Impact
            </label>
            <input
              type="text"
              value={impact}
              onChange={(e) => setImpact(e.target.value)}
              placeholder="e.g. Offsets 450 metric tons of CO2 annually"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-[#f36a26] focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#f36a26] to-[#e05514] px-5 py-2 text-xs font-bold text-white shadow-lg shadow-orange-500/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{isEditing ? "Update Project" : "Add Project"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
