import { useState } from "react";
import { useNavigate } from "react-router";
import {
  FileText,
  GitBranch,
  Clock,
  AlertTriangle,
  Rocket,
  TrendingUp,
  TrendingDown,
  Plus,
  ArrowRight,
  Activity,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import { motion } from "motion/react";
import {
  kpiData,
  activityChartData,
  qualityScoreData,
  recentChangeRequests,
  auditFeed,
} from "../data/mockData";

const iconMap: Record<string, React.ElementType> = {
  FileText,
  GitBranch,
  Clock,
  AlertTriangle,
  Rocket,
};

const kpiColorMap: Record<string, { icon: string; bg: string; text: string; ring: string }> = {
  indigo: { icon: "text-indigo-600", bg: "bg-indigo-50", text: "text-indigo-700", ring: "ring-indigo-100" },
  blue: { icon: "text-blue-600", bg: "bg-blue-50", text: "text-blue-700", ring: "ring-blue-100" },
  amber: { icon: "text-amber-600", bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-100" },
  red: { icon: "text-red-600", bg: "bg-red-50", text: "text-red-700", ring: "ring-red-100" },
  green: { icon: "text-green-600", bg: "bg-green-50", text: "text-green-700", ring: "ring-green-100" },
};

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  Approved: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  "In Review": { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  "QA Validation": { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  Deployed: { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-500" },
  Draft: { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" },
};

const riskConfig: Record<string, { bg: string; text: string }> = {
  Low: { bg: "bg-green-50", text: "text-green-700" },
  Medium: { bg: "bg-amber-50", text: "text-amber-700" },
  High: { bg: "bg-red-50", text: "text-red-700" },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-slate-200 px-4 py-3">
        <p className="text-xs text-slate-500 mb-2" style={{ fontWeight: 600 }}>{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2 text-xs mb-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-600 capitalize">{entry.name}:</span>
            <span className="text-slate-900" style={{ fontWeight: 600 }}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const QualityTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-slate-200 px-4 py-3">
        <p className="text-xs text-slate-500">Score: <span style={{ fontWeight: 600 }}>{label}</span></p>
        <p className="text-xs text-slate-900" style={{ fontWeight: 600 }}>{payload[0].value} prompts</p>
      </div>
    );
  }
  return null;
};

export function Dashboard() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div className="p-6 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-slate-900 mb-1">Quality Control Dashboard</h1>
          <p className="text-sm text-slate-500">
            Monitor prompt governance, change lifecycle, and deployment health across all environments.
          </p>
        </div>
        <button
          onClick={() => navigate("/change-requests")}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
          style={{ fontWeight: 600 }}
        >
          <Plus size={16} />
          Create Change Request
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {kpiData.map((kpi, idx) => {
          const Icon = iconMap[kpi.icon];
          const colors = kpiColorMap[kpi.color];
          return (
            <motion.div
              key={kpi.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              onHoverStart={() => setHoveredCard(kpi.id)}
              onHoverEnd={() => setHoveredCard(null)}
              className="bg-white rounded-xl border border-slate-200 p-5 cursor-default transition-all duration-200"
              style={{
                boxShadow: hoveredCard === kpi.id
                  ? "0 8px 30px rgba(0,0,0,0.08)"
                  : "0 1px 4px rgba(0,0,0,0.04)",
                transform: hoveredCard === kpi.id ? "translateY(-2px)" : "translateY(0)",
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center`}>
                  <Icon size={18} className={colors.icon} />
                </div>
                <span
                  className={`flex items-center gap-0.5 text-xs ${kpi.trendUp ? "text-green-600" : "text-red-500"}`}
                  style={{ fontWeight: 600 }}
                >
                  {kpi.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {kpi.trend}
                </span>
              </div>
              <p className="text-slate-900 mb-0.5" style={{ fontSize: "1.6rem", fontWeight: 700, lineHeight: 1.1 }}>
                {kpi.value}
              </p>
              <p className="text-sm text-slate-700 mb-1" style={{ fontWeight: 600 }}>{kpi.title}</p>
              <p className="text-xs text-slate-400">{kpi.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-slate-900">Prompt Activity Overview</h3>
              <p className="text-xs text-slate-400 mt-0.5">Changes, approvals, and deployments · Last 28 days</p>
            </div>
            <div className="flex gap-1">
              {["7D", "28D", "90D"].map((period, i) => (
                <button
                  key={period}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${i === 1 ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50"}`}
                  style={{ fontWeight: i === 1 ? 600 : 500 }}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={activityChartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorChanges" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorApprovals" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDeployments" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
                iconType="circle"
                iconSize={8}
              />
              <Area type="monotone" dataKey="changes" name="Changes" stroke="#6366f1" strokeWidth={2} fill="url(#colorChanges)" dot={false} activeDot={{ r: 4, fill: "#6366f1" }} />
              <Area type="monotone" dataKey="approvals" name="Approvals" stroke="#22c55e" strokeWidth={2} fill="url(#colorApprovals)" dot={false} activeDot={{ r: 4, fill: "#22c55e" }} />
              <Area type="monotone" dataKey="deployments" name="Deployments" stroke="#3b82f6" strokeWidth={2} fill="url(#colorDeployments)" dot={false} activeDot={{ r: 4, fill: "#3b82f6" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quality Score Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <div className="mb-6">
            <h3 className="text-slate-900">Quality Score Distribution</h3>
            <p className="text-xs text-slate-400 mt-0.5">All active prompts</p>
          </div>
          <ResponsiveContainer width="100%" height={175}>
            <BarChart data={qualityScoreData} margin={{ top: 0, right: 0, left: -28, bottom: 0 }} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="range" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip content={<QualityTooltip />} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {qualityScoreData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
            <div className="text-center">
              <p className="text-slate-900" style={{ fontSize: "1.3rem", fontWeight: 700 }}>83.4</p>
              <p className="text-xs text-slate-500">Avg Score</p>
            </div>
            <div className="text-center">
              <p className="text-green-600" style={{ fontSize: "1.3rem", fontWeight: 700 }}>48</p>
              <p className="text-xs text-slate-500">Excellent (90+)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Change Requests */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 className="text-slate-900">Recent Change Requests</h3>
            <button
              onClick={() => navigate("/change-requests")}
              className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 transition-colors"
              style={{ fontWeight: 500 }}
            >
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {recentChangeRequests.map((req) => {
              const status = statusConfig[req.status] || statusConfig["Draft"];
              const risk = riskConfig[req.risk] || riskConfig["Low"];
              return (
                <div key={req.id} className="px-6 py-4 hover:bg-slate-50 transition-colors flex items-center gap-4 cursor-pointer">
                  <div className="flex-shrink-0">
                    <p className="text-xs text-slate-400" style={{ fontWeight: 600 }}>{req.id}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900 truncate" style={{ fontWeight: 500 }}>{req.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-400">{req.version}</span>
                      <span className="text-slate-200">·</span>
                      <span className="text-xs text-slate-400">{req.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${risk.bg} ${risk.text}`} style={{ fontWeight: 500 }}>{req.risk}</span>
                    <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full ${status.bg} ${status.text}`} style={{ fontWeight: 500 }}>
                      <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                      {req.status}
                    </span>
                  </div>
                  <div className="flex-shrink-0">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs shadow-sm ${req.requestedBy.initials === "SC" ? "bg-indigo-500" : req.requestedBy.initials === "JP" ? "bg-blue-500" : req.requestedBy.initials === "LN" ? "bg-purple-500" : req.requestedBy.initials === "MT" ? "bg-green-500" : "bg-rose-500"}`}
                      style={{ fontWeight: 700 }}
                      title={req.requestedBy.name}>
                      {req.requestedBy.initials}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Audit Activity Feed */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Activity size={15} className="text-indigo-500" />
              <h3 className="text-slate-900">Live Activity</h3>
            </div>
            <button
              onClick={() => navigate("/audit-logs")}
              className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 transition-colors"
              style={{ fontWeight: 500 }}
            >
              Full log <ArrowRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {auditFeed.map((entry) => {
              const envBg = entry.envColor === "red"
                ? "bg-red-100 text-red-700"
                : entry.envColor === "amber"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-blue-100 text-blue-700";
              const actionBg = entry.action === "Approved" ? "text-green-700" : entry.action === "Rejected" ? "text-red-700" : entry.action === "Deployed" ? "text-indigo-700" : "text-slate-700";
              return (
                <div key={entry.id} className="px-5 py-3.5 hover:bg-slate-50 transition-colors flex items-start gap-3 cursor-pointer">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 shadow-sm ${entry.user.color}`}
                    style={{ fontWeight: 700 }}>
                    {entry.user.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-xs ${actionBg}`} style={{ fontWeight: 700 }}>{entry.action}</span>
                      <span className="text-xs text-slate-500 truncate">{entry.item}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-400">{entry.time}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${envBg}`} style={{ fontWeight: 600 }}>{entry.env}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}