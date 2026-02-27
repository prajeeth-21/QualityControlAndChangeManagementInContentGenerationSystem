import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  ChevronUp,
  ChevronDown,
  Eye,
  Edit3,
  GitCompare,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle,
  XCircle,
  FileText,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { promptVersions } from "../data/mockData";

type Status = "All" | "Draft" | "In Review" | "Approved" | "Rejected";
type SortKey = "name" | "version" | "status" | "lastModified" | "qualityScore";
type SortDir = "asc" | "desc";

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  Approved: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  "In Review": { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  Draft: { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" },
  Rejected: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
};

const oldVersionText = `You are a helpful customer support assistant for [Brand Name]. 
Your role is to assist customers with their inquiries in a professional, 
empathetic, and efficient manner. Always maintain a formal tone and provide 
accurate information based on our knowledge base.

Key guidelines:
- Respond within 2 business days  
- Use formal language at all times
- Escalate complex issues to human agents
- Never make promises about refunds or compensations
- Always end with "Is there anything else I can help you with?"`;

const newVersionText = `You are a friendly and knowledgeable customer support specialist for [Brand Name]. 
Your mission is to delight customers while resolving their inquiries quickly and accurately.
Adapt your communication style to match the customer's tone — be warm and conversational.

Key guidelines:
- Respond promptly and with empathy
- Use clear, human language — avoid jargon
- Proactively offer solutions before customers ask
- You may offer goodwill gestures up to $25 for minor issues
- Close with a personalized sign-off that feels genuine`;

const diffWords = (oldText: string, newText: string) => {
  const oldLines = oldText.split("\n");
  const newLines = newText.split("\n");
  return { oldLines, newLines };
};

function VersionCompareModal({ onClose }: { onClose: () => void }) {
  const { oldLines, newLines } = diffWords(oldVersionText, newVersionText);
  const removedLines = [2, 3, 4, 6, 8, 9];
  const addedLines = [2, 3, 5, 7, 8, 9];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: "blur(8px)", background: "rgba(15, 23, 42, 0.5)" }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 12 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden border border-slate-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 rounded-t-2xl flex-shrink-0">
          <div>
            <h2 className="text-slate-900">Version Comparison</h2>
            <p className="text-xs text-slate-500 mt-0.5">Customer Support Reply · v2.1 → v3.2</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-500 hover:bg-slate-200 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Split View */}
        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-2 divide-x divide-slate-200 h-full">
            {/* Old Version */}
            <div className="flex flex-col h-full overflow-hidden">
              <div className="px-4 py-3 bg-red-50 border-b border-slate-200 flex-shrink-0">
                <span className="text-xs text-red-700 px-2 py-1 bg-red-100 rounded-full" style={{ fontWeight: 600 }}>v2.1 — Previous</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <div className="font-mono text-xs leading-6 space-y-0.5">
                  {oldLines.map((line, i) => (
                    <div
                      key={i}
                      className={`px-2 py-0.5 rounded flex gap-3 ${removedLines.includes(i) ? "bg-red-50 text-red-800" : "text-slate-700"}`}
                    >
                      <span className="text-slate-300 select-none w-4 text-right flex-shrink-0">{i + 1}</span>
                      <span className="flex-1">{line || "\u00A0"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* New Version */}
            <div className="flex flex-col h-full overflow-hidden">
              <div className="px-4 py-3 bg-green-50 border-b border-slate-200 flex-shrink-0">
                <span className="text-xs text-green-700 px-2 py-1 bg-green-100 rounded-full" style={{ fontWeight: 600 }}>v3.2 — Current</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <div className="font-mono text-xs leading-6 space-y-0.5">
                  {newLines.map((line, i) => (
                    <div
                      key={i}
                      className={`px-2 py-0.5 rounded flex gap-3 ${addedLines.includes(i) ? "bg-green-50 text-green-800" : "text-slate-700"}`}
                    >
                      <span className="text-slate-300 select-none w-4 text-right flex-shrink-0">{i + 1}</span>
                      <span className="flex-1">{line || "\u00A0"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex-shrink-0">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-100 rounded" /> Added lines</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-100 rounded" /> Removed lines</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { toast.error("Version v3.2 has been rejected."); onClose(); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors text-sm"
              style={{ fontWeight: 600 }}
            >
              <XCircle size={15} /> Reject
            </button>
            <button
              onClick={() => { toast.success("Version v3.2 has been approved!"); onClose(); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-sm shadow-sm"
              style={{ fontWeight: 600 }}
            >
              <CheckCircle size={15} /> Approve Version
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

const PAGE_SIZE = 6;

export function PromptVersions() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status>("All");
  const [sortKey, setSortKey] = useState<SortKey>("lastModified");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [showCompare, setShowCompare] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filtered = useMemo(() => {
    let data = [...promptVersions];
    if (search) {
      data = data.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.owner.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (statusFilter !== "All") {
      data = data.filter((p) => p.status === statusFilter);
    }
    data.sort((a, b) => {
      let av: string | number = a[sortKey as keyof typeof a] as string | number;
      let bv: string | number = b[sortKey as keyof typeof b] as string | number;
      if (typeof av === "string") av = av.toLowerCase();
      if (typeof bv === "string") bv = bv.toLowerCase();
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return data;
  }, [search, statusFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const SortIcon = ({ col }: { col: SortKey }) => (
    <span className="ml-1 inline-flex flex-col">
      <ChevronUp size={9} className={sortKey === col && sortDir === "asc" ? "text-indigo-600" : "text-slate-300"} />
      <ChevronDown size={9} className={sortKey === col && sortDir === "desc" ? "text-indigo-600" : "text-slate-300"} />
    </span>
  );

  return (
    <div className="p-6 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-slate-900 mb-1">Prompt Versions</h1>
          <p className="text-sm text-slate-500">Manage, review, and compare all prompt versions across your projects.</p>
        </div>
        <button
          onClick={() => { setShowCreateModal(true); toast.info("Opening version creation form…"); }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm transition-all shadow-sm"
          style={{ fontWeight: 600 }}
        >
          <Plus size={16} /> Create New Version
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4 flex flex-wrap gap-3 items-center" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search prompts or owners..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all bg-slate-50 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={14} className="text-slate-400" />
          {(["All", "Draft", "In Review", "Approved", "Rejected"] as Status[]).map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs transition-all ${statusFilter === s ? "bg-indigo-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
              style={{ fontWeight: 500 }}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="ml-auto text-xs text-slate-400">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <FileText size={24} className="text-slate-400" />
            </div>
            <p className="text-slate-700 mb-1" style={{ fontWeight: 600 }}>No prompt versions found</p>
            <p className="text-sm text-slate-400">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  {[
                    { key: "name" as SortKey, label: "Prompt Name" },
                    { key: "version" as SortKey, label: "Version" },
                    { key: "status" as SortKey, label: "Status" },
                    { key: "qualityScore" as SortKey, label: "Quality Score" },
                    { key: "lastModified" as SortKey, label: "Last Modified" },
                  ].map(({ key, label }) => (
                    <th
                      key={key}
                      onClick={() => handleSort(key)}
                      className="text-left px-5 py-3 text-xs text-slate-500 cursor-pointer select-none hover:text-slate-700 transition-colors whitespace-nowrap"
                      style={{ fontWeight: 600 }}
                    >
                      {label} <SortIcon col={key} />
                    </th>
                  ))}
                  <th className="text-left px-5 py-3 text-xs text-slate-500 whitespace-nowrap" style={{ fontWeight: 600 }}>Owner</th>
                  <th className="text-left px-5 py-3 text-xs text-slate-500" style={{ fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((prompt, idx) => {
                  const status = statusConfig[prompt.status];
                  return (
                    <motion.tr
                      key={prompt.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.04 }}
                      className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-900" style={{ fontWeight: 500 }}>{prompt.name}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-mono" style={{ fontWeight: 600 }}>{prompt.version}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full w-fit ${status.bg} ${status.text}`} style={{ fontWeight: 500 }}>
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${status.dot}`} />
                          {prompt.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 max-w-[80px] bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${prompt.qualityScore >= 85 ? "bg-green-500" : prompt.qualityScore >= 70 ? "bg-blue-500" : prompt.qualityScore >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                              style={{ width: `${prompt.qualityScore}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-700" style={{ fontWeight: 600 }}>{prompt.qualityScore}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Clock size={12} />
                          {prompt.lastModified}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs shadow-sm ${prompt.owner.color}`} style={{ fontWeight: 700 }}>
                            {prompt.owner.initials}
                          </div>
                          <span className="text-sm text-slate-700 hidden xl:block" style={{ fontWeight: 500 }}>{prompt.owner.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => toast.info(`Viewing ${prompt.name} ${prompt.version}`)}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
                            title="View"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => toast.info(`Editing ${prompt.name} ${prompt.version}`)}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
                            title="Edit"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => setShowCompare(true)}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
                            title="Compare versions"
                          >
                            <GitCompare size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50">
              <p className="text-xs text-slate-500">
                Showing <span style={{ fontWeight: 600 }}>{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}</span> of <span style={{ fontWeight: 600 }}>{filtered.length}</span> versions
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={15} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-7 h-7 rounded-lg text-xs transition-colors ${page === p ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-200"}`}
                    style={{ fontWeight: page === p ? 600 : 500 }}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Compare Modal */}
      <AnimatePresence>
        {showCompare && <VersionCompareModal onClose={() => setShowCompare(false)} />}
      </AnimatePresence>
    </div>
  );
}
