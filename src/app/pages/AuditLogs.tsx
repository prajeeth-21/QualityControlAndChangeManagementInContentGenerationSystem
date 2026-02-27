import { useState } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Calendar,
  Download,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { auditLogs } from "../data/mockData";

const actionFilters = ["All Actions", "Deployed", "Approved", "Rejected", "Created", "Modified", "Reviewed"];
const userFilters = ["All Users", "Sarah Chen", "James Park", "Leila Nouri", "Mike Torres", "Anna Kim", "Rachel Wong", "David Lee"];
const envFilters = ["All Environments", "Dev", "Staging", "Prod"];

export function AuditLogs() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("All Actions");
  const [userFilter, setUserFilter] = useState("All Users");
  const [envFilter, setEnvFilter] = useState("All Environments");
  const [dateRange, setDateRange] = useState("Last 7 days");

  const filtered = auditLogs.filter((log) => {
    const matchSearch =
      !search ||
      log.item.toLowerCase().includes(search.toLowerCase()) ||
      log.user.name.toLowerCase().includes(search.toLowerCase()) ||
      log.changeId.toLowerCase().includes(search.toLowerCase());
    const matchAction = actionFilter === "All Actions" || log.action === actionFilter;
    const matchUser = userFilter === "All Users" || log.user.name === userFilter;
    const matchEnv = envFilter === "All Environments" || log.env === envFilter;
    return matchSearch && matchAction && matchUser && matchEnv;
  });

  const toggle = (id: number) => setExpandedId(expandedId === id ? null : id);

  return (
    <div className="p-6 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-slate-900 mb-1">Audit Logs</h1>
          <p className="text-sm text-slate-500">
            Complete timeline of all governance events, changes, and user actions.
          </p>
        </div>
        <button
          onClick={() => toast.success("Exporting audit log as CSV…")}
          className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 bg-white transition-colors"
          style={{ fontWeight: 500 }}
        >
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 flex flex-wrap gap-3 items-center" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        {/* Search */}
        <div className="relative min-w-[200px] flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all bg-slate-50 focus:bg-white"
          />
        </div>

        {/* Date Range */}
        <div className="relative">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 bg-slate-50 outline-none focus:border-indigo-300 cursor-pointer"
            style={{ fontWeight: 500 }}
          >
            {["Last 24 hours", "Last 7 days", "Last 30 days", "Last 90 days", "Custom range"].map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* Action */}
        <div className="relative">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 bg-slate-50 outline-none focus:border-indigo-300 cursor-pointer"
            style={{ fontWeight: 500 }}
          >
            {actionFilters.map((a) => <option key={a}>{a}</option>)}
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* User */}
        <div className="relative">
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 bg-slate-50 outline-none focus:border-indigo-300 cursor-pointer"
            style={{ fontWeight: 500 }}
          >
            {userFilters.map((u) => <option key={u}>{u}</option>)}
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* Environment */}
        <div className="relative">
          <select
            value={envFilter}
            onChange={(e) => setEnvFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 bg-slate-50 outline-none focus:border-indigo-300 cursor-pointer"
            style={{ fontWeight: 500 }}
          >
            {envFilters.map((e) => <option key={e}>{e}</option>)}
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        <div className="ml-auto text-xs text-slate-400">
          {filtered.length} event{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[28px] top-0 bottom-0 w-px bg-slate-200" />

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center py-20">
              <Filter size={32} className="text-slate-300 mb-3" />
              <p className="text-slate-700 mb-1" style={{ fontWeight: 600 }}>No audit events found</p>
              <p className="text-sm text-slate-400">Try adjusting your filters.</p>
            </div>
          ) : (
            filtered.map((log, idx) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="relative pl-16"
              >
                {/* Avatar on timeline */}
                <div className="absolute left-0 top-4 z-10">
                  <div
                    className={`w-[42px] h-[42px] rounded-full flex items-center justify-center text-white shadow-sm flex-shrink-0 ${log.user.color} ring-4 ring-[#F8FAFC]`}
                    style={{ fontWeight: 700, fontSize: "13px" }}
                  >
                    {log.user.initials}
                  </div>
                </div>

                {/* Card */}
                <div
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden cursor-pointer hover:border-slate-300 transition-all"
                  style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
                  onClick={() => toggle(log.id)}
                >
                  <div className="flex items-center gap-4 px-5 py-4">
                    {/* Action badge */}
                    <span className={`text-xs px-2.5 py-1 rounded-full flex-shrink-0 ${log.actionColor}`} style={{ fontWeight: 600 }}>
                      {log.action}
                    </span>

                    {/* Item */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900 truncate" style={{ fontWeight: 500 }}>{log.item}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-500" style={{ fontWeight: 500 }}>{log.user.name}</span>
                        <span className="text-slate-200">·</span>
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Calendar size={10} />
                          {log.timestamp}
                        </span>
                      </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-xs text-slate-400 font-mono" style={{ fontWeight: 600 }}>{log.changeId}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-md ${log.envColor}`} style={{ fontWeight: 600 }}>
                        {log.env}
                      </span>
                      <motion.div
                        animate={{ rotate: expandedId === log.id ? 90 : 0 }}
                        transition={{ duration: 0.18 }}
                      >
                        <ChevronRight size={15} className="text-slate-400" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Expandable Details */}
                  <AnimatePresence>
                    {expandedId === log.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-0 border-t border-slate-100">
                          <div className="mt-4 bg-slate-50 rounded-lg p-4">
                            <p className="text-xs text-slate-500 mb-2" style={{ fontWeight: 600 }}>Event Details</p>
                            <p className="text-sm text-slate-700 leading-relaxed">{log.details}</p>
                          </div>
                          <div className="mt-3 grid grid-cols-3 gap-3">
                            <div className="bg-slate-50 rounded-lg p-3">
                              <p className="text-xs text-slate-400 mb-1">Change ID</p>
                              <p className="text-sm text-slate-700 font-mono" style={{ fontWeight: 600 }}>{log.changeId}</p>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-3">
                              <p className="text-xs text-slate-400 mb-1">Environment</p>
                              <span className={`text-xs px-2 py-1 rounded-md ${log.envColor}`} style={{ fontWeight: 600 }}>{log.env}</span>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-3">
                              <p className="text-xs text-slate-400 mb-1">Timestamp</p>
                              <p className="text-xs text-slate-700" style={{ fontWeight: 500 }}>{log.timestamp}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
