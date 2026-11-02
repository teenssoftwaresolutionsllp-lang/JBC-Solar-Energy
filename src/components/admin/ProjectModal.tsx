"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  SunMedium,
  Loader2,
  AlertCircle,
  UploadCloud,
  ImageIcon,
  Check,
  RotateCcw,
  Link as LinkIcon,
  Sparkles,
} from "lucide-react";
import { SolarProjectRecord } from "@/lib/admin-types";

interface ProjectModalProps {
  isOpen: boolean;
  project?: SolarProjectRecord | null;
  onClose: () => void;
  onSuccess: () => void;
}

const PRESET_IMAGES = [
  { label: "Commercial Rooftop", path: "/images/image 7.png" },
  { label: "Net-Zero Residential", path: "/images/image 6.png" },
  { label: "Industrial Microgrid", path: "/images/image 17.png" },
  { label: "Solar Carport", path: "/images/image 8.png" },
  { label: "Agri-Solar Farm", path: "/images/image 9.png" },
  { label: "Community Rooftop", path: "/images/image 11.png" },
  { label: "Utility Solar Field 1", path: "/images/solar-image-1.jpg" },
  { label: "Utility Solar Field 2", path: "/images/solar-image-2.jpg" },
];

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

  const [imageTab, setImageTab] = useState<"upload" | "preset" | "url">("upload");
  const [customUrlInput, setCustomUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setCategory(project.category);
      setCapacity(project.capacity);
      setLocation(project.location);
      setClient(project.client);
      setCompletionYear(project.completionYear);
      setStatus(project.status);
      setImage(project.image || "/images/image 7.png");
      setCustomUrlInput(project.image || "");
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
      setCustomUrlInput("");
      setDescription("");
      setImpact("");
    }
    setUploadError(null);
    setError(null);
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Check size limit: 10MB
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Image file size must be less than 10MB.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload a valid image file (JPG, PNG, WEBP, AVIF).");
      return;
    }

    setUploadError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to upload image.");
      }

      setImage(data.url);
      setCustomUrlInput(data.url);
    } catch (err: unknown) {
      console.error("Upload error:", err);
      if (err instanceof Error) {
        setUploadError(err.message);
      } else {
        setUploadError("An error occurred while uploading image.");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !capacity.trim() || !location.trim()) {
      setError("Title, capacity, and location are required.");
      return;
    }

    if (uploading) {
      setError("Please wait until the image finishes uploading.");
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
          image: image.trim() || "/images/image 7.png",
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
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0f172a] border border-slate-700/80 shadow-2xl p-6 text-slate-200">
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
            type="button"
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

          {/* PROJECT IMAGE UPLOAD & SELECTION SECTION */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="block text-xs font-bold text-white flex items-center gap-1.5">
                  <ImageIcon className="h-4 w-4 text-[#f36a26]" />
                  <span>Project Installation Image</span>
                </label>
                <p className="text-[11px] text-slate-400">
                  This photo is showcased prominently in the public projects portfolio.
                </p>
              </div>

              {/* Segmented Controls for Image Source */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setImageTab("upload")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    imageTab === "upload"
                      ? "bg-[#f36a26] text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <UploadCloud className="h-3 w-3" />
                  <span>Upload</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImageTab("preset")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    imageTab === "preset"
                      ? "bg-[#f36a26] text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Sparkles className="h-3 w-3" />
                  <span>Presets</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImageTab("url")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    imageTab === "url"
                      ? "bg-[#f36a26] text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <LinkIcon className="h-3 w-3" />
                  <span>URL</span>
                </button>
              </div>
            </div>

            {uploadError && (
              <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-2.5 text-xs text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* TAB 1: FILE UPLOAD (DRAG & DROP) */}
            {imageTab === "upload" && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => !uploading && fileInputRef.current?.click()}
                  className={`relative flex flex-col items-center justify-center p-5 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
                    isDragging
                      ? "border-[#f36a26] bg-[#f36a26]/10"
                      : "border-slate-700/80 bg-slate-950/60 hover:border-slate-600 hover:bg-slate-950"
                  }`}
                >
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2 py-3 text-center">
                      <Loader2 className="h-7 w-7 text-[#f36a26] animate-spin" />
                      <p className="text-xs font-semibold text-white">Uploading project image...</p>
                      <p className="text-[10px] text-slate-400">Saving to gallery storage</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-center py-1">
                      <div className="p-3 rounded-full bg-slate-800/80 border border-slate-700 text-[#f36a26]">
                        <UploadCloud className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">
                          <span className="text-[#f36a26] underline underline-offset-2">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          PNG, JPG, WEBP, or AVIF (max 10MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: PRESET GALLERY SELECTOR */}
            {imageTab === "preset" && (
              <div className="space-y-2">
                <p className="text-[11px] text-slate-400">
                  Select from our verified high-resolution solar installation library:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PRESET_IMAGES.map((preset) => {
                    const isSelected = image === preset.path;
                    return (
                      <button
                        key={preset.path}
                        type="button"
                        onClick={() => {
                          setImage(preset.path);
                          setCustomUrlInput(preset.path);
                        }}
                        className={`relative rounded-xl overflow-hidden border p-1 text-left transition-all group ${
                          isSelected
                            ? "border-[#f36a26] ring-2 ring-[#f36a26]/40 bg-slate-800"
                            : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                        }`}
                      >
                        <div className="relative h-16 w-full rounded-lg overflow-hidden bg-slate-900">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={preset.path}
                            alt={preset.label}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {isSelected && (
                            <div className="absolute top-1 right-1 bg-[#f36a26] text-white p-0.5 rounded-full shadow-sm">
                              <Check className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] font-medium text-slate-300 mt-1 truncate px-1">
                          {preset.label}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: CUSTOM URL */}
            {imageTab === "url" && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    placeholder="https://example.com/solar-array.jpg or /images/..."
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-[#f36a26] focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customUrlInput.trim()) {
                        setImage(customUrlInput.trim());
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
                  >
                    Apply URL
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Enter any public HTTPS image link or local path.
                </p>
              </div>
            )}

            {/* LIVE PREVIEW BOX */}
            {image && (
              <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-2.5">
                <div className="relative h-16 w-24 shrink-0 rounded-lg overflow-hidden bg-slate-900 border border-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt="Project preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/images/image 7.png";
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-white">Active Image Selected</span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5" title={image}>
                    {image}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-medium text-slate-200 transition-colors"
                    title="Choose a different image file"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setImage("/images/image 7.png");
                      setCustomUrlInput("/images/image 7.png");
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                    title="Reset to default image"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
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
              disabled={loading || uploading}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
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
