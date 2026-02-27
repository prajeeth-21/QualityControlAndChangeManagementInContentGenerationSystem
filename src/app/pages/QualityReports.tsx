import { useState } from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, TrendingDown, Award, AlertTriangle, CheckCircle, Target } from "lucide-react";
import { motion } from "motion/react";

const qualityTrend = [
  { week: "W1", overall: 78, tone: 82, grammar: 85, safety: 98, brand: 71 },
  { week: "W2", overall: 80, tone: 84, grammar: 86, safety: 99, brand: 74 },
  { week: "W3", overall: 79, tone: 81, grammar: 84, safety: 97, brand: 73 },
  { week: "W4", overall: 83, tone: 86, grammar: 88, safety: 100, brand: 77 },
  { week: "W5", overall: 82, tone: 85, grammar: 87, safety: 100, brand: 75 },
  { week: "W6", overall: 85, tone: 88, grammar: 90, safety: 100, brand: 80 },
  { week: "W7", overall: 83, tone: 87, grammar: 89, safety: 99, brand: 79 },
  { week: "W8", overall: 87, tone: 90, grammar: 92, safety: 100, brand: 83 },
];

const radarData = [
  { subject: "Tone", score: 90 },
  { subject: "Grammar", score: 92 },
  { subject: "Safety", score: 100 },
  { subject: "Brand", score: 83 },
  { subject: "Clarity", score: 88 },
  { subject: "Compliance", score: 85 },
];

const projectScores = [
  { project: "E-Commerce", score: 91, passed: 31, failed: 3 },
  { project: "Support AI", score: 87, passed: 50, failed: 8 },
  { project: "Marketing", score: 78, passed: 32, failed: 9 },
  { project: "Onboarding", score: 85, passed: 23, failed: 4 },
  { project: "Brand Voice", score: 96, passed: 14, failed: 1 },
  { project: "B2B Sales", score: 72, passed: 16, failed: 6 },
];

const failureReasons = [
  { name: "Tone Mismatch", value: 28, color: "#f59e0b" },
  { name: "Brand Deviation", value: 22, color: "#ef4444" },
  { name: "Grammar Issues", value: 18, color: "#6366f1" },
  { name: "Safety Violation", value: 12, color: "#dc2626" },
  { name: "Length Issues", value: 20, color: "#3b82f6" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-slate-200 px-4 py-3">
        <p className="text-xs text-slate-500 mb-2" style={{ fontWeight: 600 }}>{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2 text-xs mb-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-600">{entry.name}:</span>
            <span className="text-slate-900" style={{ fontWeight: 600 }}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const metricCards = [
  { label: "Avg. Quality Score", value: "83.4", delta: "+4.2", up: true, icon: Award, color: "indigo" },
  { label: "Pass Rate (30d)", value: "89.3%", delta: "+2.1%", up: true, icon: CheckCircle, color: "green" },
  { label: "Critical Failures", value: "7", delta: "-3", up: true, icon: AlertTriangle, color: "red" },
  { label: "Avg. Review Cycles", value: "2.4", delta: "-0.6", up: true, icon: Target, color: "blue" },
];

const colorMap: Record<string, { bg: string; icon: string; text: string }> = {
  indigo: { bg: "bg-indigo-50", icon: "text-indigo-600", text: "text-indigo-700" },
  green: { bg: "bg-green-50", icon: "text-green-600", text: "text-green-700" },
  red: { bg: "bg-red-50", icon: "text-red-600", text: "text-red-700" },
  blue: { bg: "bg-blue-50", icon: "text-blue-600", text: "text-blue-700" },
};

export function QualityReports() {
  const [period, setPeriod] = useState("8W");

  return (
    <div className="p-6 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-slate-900 mb-1">Quality Reports</h1>
          <p className="text-sm text-slate-500">Comprehensive quality analytics across all prompts and projects.</p>
        </div>
        <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1">
          {["4W", "8W", "3M", "6M"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-xs rounded-md transition-all ${period === p ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              style={{ fontWeight: period === p ? 600 : 500 }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metricCards.map((card, idx) => {
          const colors = colorMap[card.color];
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}
              className="bg-white rounded-xl border border-slate-200 p-5"
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-9 h-9 ${colors.bg} rounded-lg flex items-center justify-center`}>
                  <card.icon size={17} className={colors.icon} />
                </div>
                <span className={`flex items-center gap-0.5 text-xs ${card.up ? "text-green-600" : "text-red-500"}`} style={{ fontWeight: 600 }}>
                  {card.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {card.delta}
                </span>
              </div>
              <p className="text-slate-900 mb-0.5" style={{ fontSize: "1.5rem", fontWeight: 700, lineHeight: 1.1 }}>{card.value}</p>
              <p className="text-xs text-slate-500">{card.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Quality Trend */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <div className="mb-5">
            <h3 className="text-slate-900">Quality Score Trend</h3>
            <p className="text-xs text-slate-400 mt-0.5">Weekly average scores by dimension</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={qualityTrend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={[60, 105]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }} iconType="circle" iconSize={7} />
              <Line type="monotone" dataKey="overall" name="Overall" stroke="#6366f1" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
              <Line type="monotone" dataKey="tone" name="Tone" stroke="#22c55e" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
              <Line type="monotone" dataKey="grammar" name="Grammar" stroke="#3b82f6" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
              <Line type="monotone" dataKey="brand" name="Brand" stroke="#f59e0b" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Radar */}
        <div className="bg-white rounded-xl border border-slate-200 p-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <div className="mb-5">
            <h3 className="text-slate-900">Quality Dimensions</h3>
            <p className="text-xs text-slate-400 mt-0.5">Current period average</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#64748b" }} />
              <Radar name="Score" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Project Scores */}
        <div className="bg-white rounded-xl border border-slate-200 p-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <div className="mb-5">
            <h3 className="text-slate-900">Score by Project</h3>
            <p className="text-xs text-slate-400 mt-0.5">Passed vs. failed prompts per project</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={projectScores} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="project" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} iconType="circle" iconSize={7} />
              <Bar dataKey="passed" name="Passed" fill="#6366f1" radius={[3, 3, 0, 0]} />
              <Bar dataKey="failed" name="Failed" fill="#fca5a5" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Failure Reasons */}
        <div className="bg-white rounded-xl border border-slate-200 p-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <div className="mb-5">
            <h3 className="text-slate-900">Failure Root Causes</h3>
            <p className="text-xs text-slate-400 mt-0.5">Distribution of QC failure reasons</p>
          </div>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie
                  data={failureReasons}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {failureReasons.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`, ""]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {failureReasons.map((reason) => (
                <div key={reason.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: reason.color }} />
                  <span className="text-xs text-slate-600 flex-1" style={{ fontWeight: 500 }}>{reason.name}</span>
                  <span className="text-xs text-slate-400" style={{ fontWeight: 600 }}>{reason.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Project Scores Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="text-slate-900">Project Quality Summary</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left px-6 py-3 text-xs text-slate-500" style={{ fontWeight: 600 }}>Project</th>
              <th className="text-left px-6 py-3 text-xs text-slate-500" style={{ fontWeight: 600 }}>Avg. Score</th>
              <th className="text-left px-6 py-3 text-xs text-slate-500" style={{ fontWeight: 600 }}>Score Trend</th>
              <th className="text-left px-6 py-3 text-xs text-slate-500" style={{ fontWeight: 600 }}>Passed</th>
              <th className="text-left px-6 py-3 text-xs text-slate-500" style={{ fontWeight: 600 }}>Failed</th>
              <th className="text-left px-6 py-3 text-xs text-slate-500" style={{ fontWeight: 600 }}>Pass Rate</th>
            </tr>
          </thead>
          <tbody>
            {projectScores.map((p, i) => {
              const total = p.passed + p.failed;
              const rate = Math.round((p.passed / total) * 100);
              return (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-900" style={{ fontWeight: 500 }}>{p.project}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm ${p.score >= 90 ? "text-green-600" : p.score >= 80 ? "text-blue-600" : p.score >= 70 ? "text-amber-600" : "text-red-600"}`}
                        style={{ fontWeight: 700 }}
                      >
                        {p.score}
                      </span>
                      <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${p.score >= 90 ? "bg-green-500" : p.score >= 80 ? "bg-blue-500" : p.score >= 70 ? "bg-amber-500" : "bg-red-500"}`}
                          style={{ width: `${p.score}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 text-xs text-green-600" style={{ fontWeight: 500 }}>
                      <TrendingUp size={12} /> +2.3
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-green-700" style={{ fontWeight: 600 }}>{p.passed}</td>
                  <td className="px-6 py-4 text-sm text-red-600" style={{ fontWeight: 600 }}>{p.failed}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full ${rate >= 90 ? "bg-green-50 text-green-700" : rate >= 80 ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"}`}
                      style={{ fontWeight: 600 }}
                    >
                      {rate}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
