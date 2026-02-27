import { useState } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  GitBranch,
  FileText,
  Users,
  Calendar,
  TrendingUp,
  Grid,
  List,
  ArrowRight,
  Star,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { contentProjects } from "../data/mockData";

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  Active: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  Review: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  Archived: { bg: "bg-slate-100", text: "text-slate-500", dot: "bg-slate-400" },
};

function ProjectCard({ project, idx }: { project: typeof contentProjects[0]; idx: number }) {
  const status = statusConfig[project.status];
  const [starred, setStarred] = useState(idx === 0 || idx === 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.06 }}
      className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
    >
      {/* Top bar accent */}
      <div
        className={`h-1 ${project.qualityScore >= 90 ? "bg-gradient-to-r from-green-400 to-emerald-500" : project.qualityScore >= 80 ? "bg-gradient-to-r from-indigo-400 to-blue-500" : project.qualityScore >= 70 ? "bg-gradient-to-r from-amber-400 to-orange-400" : "bg-gradient-to-r from-red-400 to-rose-500"}`}
      />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-slate-900 truncate" style={{ fontSize: "15px" }}>{project.name}</h3>
            </div>
            <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full ${status.bg} ${status.text}`} style={{ fontWeight: 500 }}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {project.status}
            </span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); setStarred(!starred); }}
              className={`p-1.5 rounded-lg transition-colors ${starred ? "text-amber-400 hover:bg-amber-50" : "text-slate-300 hover:text-slate-400 hover:bg-slate-100"}`}
            >
              <Star size={14} fill={starred ? "currentColor" : "none"} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); toast.info(`Options for ${project.name}`); }}
              className="p-1.5 rounded-lg text-slate-300 hover:text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <MoreHorizontal size={14} />
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">{project.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.map((tag) => (
            <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full" style={{ fontWeight: 500 }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-slate-50 rounded-lg p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <FileText size={11} className="text-slate-400" />
              <span className="text-slate-900" style={{ fontWeight: 700, fontSize: "15px" }}>{project.promptCount}</span>
            </div>
            <p className="text-xs text-slate-400">Prompts</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <GitBranch size={11} className="text-slate-400" />
              <span className="text-slate-900" style={{ fontWeight: 700, fontSize: "15px" }}>{project.activeVersions}</span>
            </div>
            <p className="text-xs text-slate-400">Versions</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <TrendingUp size={11} className={project.qualityScore >= 80 ? "text-green-500" : "text-amber-500"} />
              <span className={`${project.qualityScore >= 80 ? "text-green-600" : "text-amber-600"}`} style={{ fontWeight: 700, fontSize: "15px" }}>{project.qualityScore}</span>
            </div>
            <p className="text-xs text-slate-400">QC Score</p>
          </div>
        </div>

        {/* Quality bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Quality Score</span>
            <span style={{ fontWeight: 600 }}>{project.qualityScore}/100</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${project.qualityScore >= 90 ? "bg-gradient-to-r from-green-400 to-emerald-500" : project.qualityScore >= 80 ? "bg-gradient-to-r from-indigo-400 to-blue-500" : project.qualityScore >= 70 ? "bg-gradient-to-r from-amber-400 to-orange-400" : "bg-gradient-to-r from-red-400 to-rose-500"}`}
              style={{ width: `${project.qualityScore}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs shadow-sm ${project.owner.color}`} style={{ fontWeight: 700 }}>
              {project.owner.initials}
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Users size={11} />
              {project.members}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Calendar size={11} />
              {project.lastUpdated.replace(", 2026", "")}
            </div>
            <button
              className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 opacity-0 group-hover:opacity-100 transition-all"
              style={{ fontWeight: 500 }}
            >
              Open <ArrowRight size={11} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProjectRow({ project, idx }: { project: typeof contentProjects[0]; idx: number }) {
  const status = statusConfig[project.status];
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.05 }}
      className="flex items-center gap-5 px-6 py-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-0.5">
          <p className="text-sm text-slate-900" style={{ fontWeight: 600 }}>{project.name}</p>
          <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${status.bg} ${status.text}`} style={{ fontWeight: 500 }}>
            <span className={`w-1 h-1 rounded-full ${status.dot}`} />
            {project.status}
          </span>
        </div>
        <p className="text-xs text-slate-400 truncate">{project.description}</p>
      </div>
      <div className="flex items-center gap-6 flex-shrink-0 text-xs text-slate-500">
        <span className="flex items-center gap-1"><FileText size={12} /> {project.promptCount}</span>
        <span className="flex items-center gap-1"><GitBranch size={12} /> {project.activeVersions}</span>
        <div className="flex items-center gap-2">
          <div className="w-16 bg-slate-100 rounded-full h-1.5">
            <div
              className={`h-full rounded-full ${project.qualityScore >= 90 ? "bg-green-500" : project.qualityScore >= 80 ? "bg-indigo-500" : project.qualityScore >= 70 ? "bg-amber-500" : "bg-red-500"}`}
              style={{ width: `${project.qualityScore}%` }}
            />
          </div>
          <span style={{ fontWeight: 600 }}>{project.qualityScore}</span>
        </div>
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs ${project.owner.color}`} style={{ fontWeight: 700 }}>
          {project.owner.initials}
        </div>
        <span className="flex items-center gap-1"><Calendar size={12} /> {project.lastUpdated.replace(", 2026", "")}</span>
      </div>
    </motion.div>
  );
}

export function ContentProjects() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filtered = contentProjects.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-slate-900 mb-1">Content Projects</h1>
          <p className="text-sm text-slate-500">
            Manage all content generation projects and their associated prompt libraries.
          </p>
        </div>
        <button
          onClick={() => toast.info("Opening project creation form...")}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm transition-all shadow-sm"
          style={{ fontWeight: 600 }}
        >
          <Plus size={16} /> New Project
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Projects", value: contentProjects.length, color: "text-slate-900" },
          { label: "Active", value: contentProjects.filter((p) => p.status === "Active").length, color: "text-green-600" },
          { label: "Under Review", value: contentProjects.filter((p) => p.status === "Review").length, color: "text-amber-600" },
          { label: "Archived", value: contentProjects.filter((p) => p.status === "Archived").length, color: "text-slate-400" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4 text-center" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <p className={`text-2xl mb-0.5 ${stat.color}`} style={{ fontWeight: 700 }}>{stat.value}</p>
            <p className="text-xs text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters + View Toggle */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-5 flex flex-wrap gap-3 items-center" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <div className="relative min-w-[200px] flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all bg-slate-50 focus:bg-white"
          />
        </div>
        <div className="flex gap-1.5">
          {["All", "Active", "Review", "Archived"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-all ${statusFilter === s ? "bg-indigo-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
              style={{ fontWeight: 500 }}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-1 bg-slate-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-700"}`}
          >
            <Grid size={15} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded-md transition-all ${viewMode === "list" ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-700"}`}
          >
            <List size={15} />
          </button>
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center py-20">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <FileText size={24} className="text-slate-400" />
          </div>
          <p className="text-slate-700 mb-1" style={{ fontWeight: 600 }}>No projects found</p>
          <p className="text-sm text-slate-400">Try adjusting your search or filter criteria.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((project, idx) => (
            <ProjectCard key={project.id} project={project} idx={idx} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <div className="flex items-center gap-5 px-6 py-3 border-b border-slate-100 bg-slate-50">
            <div className="flex-1 text-xs text-slate-500" style={{ fontWeight: 600 }}>Project</div>
            <div className="flex items-center gap-6 flex-shrink-0 text-xs text-slate-500" style={{ fontWeight: 600 }}>
              <span className="w-16 text-center">Prompts</span>
              <span className="w-14 text-center">Versions</span>
              <span className="w-28 text-center">Quality</span>
              <span className="w-8">Owner</span>
              <span className="w-20 text-right">Updated</span>
            </div>
          </div>
          {filtered.map((project, idx) => (
            <ProjectRow key={project.id} project={project} idx={idx} />
          ))}
        </div>
      )}
    </div>
  );
}
