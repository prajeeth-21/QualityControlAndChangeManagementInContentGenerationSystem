import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  AlertTriangle,
  ChevronRight,
  MessageSquare,
  FileText,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { approvalItems } from "../data/mockData";

const stageFlow = ["QA Validation", "Senior Review", "Final Approval", "Deployment"];

const riskConfig: Record<string, { bg: string; text: string; border: string }> = {
  Low: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  Medium: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  High: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
};

const priorityConfig: Record<string, { bg: string; text: string }> = {
  Low: { bg: "bg-slate-100", text: "text-slate-600" },
  Medium: { bg: "bg-amber-50", text: "text-amber-700" },
  High: { bg: "bg-red-50", text: "text-red-700" },
};

function StageIndicator({ stage }: { stage: string }) {
  const currentIdx = stageFlow.indexOf(stage);
  return (
    <div className="flex items-center gap-0">
      {stageFlow.map((s, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        return (
          <div key={s} className="flex items-center">
            <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs transition-all ${active ? "bg-indigo-600 text-white" : done ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-400"}`} style={{ fontWeight: active || done ? 600 : 500 }}>
              {done && <CheckCircle size={11} />}
              {s}
            </div>
            {i < stageFlow.length - 1 && (
              <ChevronRight size={14} className={`mx-1 ${i < currentIdx ? "text-green-400" : "text-slate-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function QualityMeter({ score }: { score: number }) {
  const color = score >= 85 ? "#22c55e" : score >= 70 ? "#6366f1" : score >= 55 ? "#f59e0b" : "#ef4444";
  const circumference = 2 * Math.PI * 38;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-24 h-24">
      <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
        <circle cx="48" cy="48" r="38" fill="none" stroke="#f1f5f9" strokeWidth="8" />
        <circle
          cx="48" cy="48" r="38"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span style={{ fontSize: "18px", fontWeight: 700, color, lineHeight: 1 }}>{score}</span>
        <span className="text-xs text-slate-400" style={{ fontWeight: 500 }}>/ 100</span>
      </div>
    </div>
  );
}

function ApprovalDetailModal({ item, onClose }: { item: typeof approvalItems[0]; onClose: () => void }) {
  const [comment, setComment] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: "blur(8px)", background: "rgba(15, 23, 42, 0.5)" }}
    >
      <motion.div
        initial={{ scale: 0.95, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 12 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden border border-slate-200"
      >
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-200 bg-slate-50 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-slate-400 font-mono" style={{ fontWeight: 600 }}>{item.id}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${riskConfig[item.risk].bg} ${riskConfig[item.risk].text} ${riskConfig[item.risk].border}`} style={{ fontWeight: 500 }}>
                {item.risk} Risk
              </span>
            </div>
            <h2 className="text-slate-900" style={{ fontSize: "16px" }}>{item.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Stage flow */}
          <div>
            <p className="text-xs text-slate-500 mb-3" style={{ fontWeight: 600 }}>Workflow Stage</p>
            <StageIndicator stage={item.stage} />
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1" style={{ fontWeight: 600 }}>Quality Score</p>
              <div className="flex items-center gap-3">
                <QualityMeter score={item.qualityScore} />
                <div>
                  <p className="text-xs text-slate-500">{item.testsPassed}/{item.testsTotal} tests passed</p>
                  <div className="mt-2 w-24 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${(item.testsPassed / item.testsTotal) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500 mb-1" style={{ fontWeight: 600 }}>Requested By</p>
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${item.requestedBy.color}`} style={{ fontWeight: 700 }}>{item.requestedBy.initials}</div>
                  <span className="text-sm text-slate-700" style={{ fontWeight: 500 }}>{item.requestedBy.name}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1" style={{ fontWeight: 600 }}>Due Date</p>
                <div className="flex items-center gap-1 text-sm text-slate-700">
                  <Calendar size={13} className="text-slate-400" /> {item.dueDate}
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1" style={{ fontWeight: 600 }}>Version</p>
                <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded-md" style={{ fontWeight: 600 }}>{item.version}</span>
              </div>
            </div>
          </div>

          {/* Previous Approvers */}
          {item.previousApprovers.length > 0 && (
            <div>
              <p className="text-xs text-slate-500 mb-3" style={{ fontWeight: 600 }}>Approval History</p>
              <div className="space-y-2">
                {item.previousApprovers.map((approver, i) => (
                  <div key={i} className="flex items-center gap-3 bg-green-50 rounded-lg px-4 py-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs ${approver.color}`} style={{ fontWeight: 700 }}>{approver.initials}</div>
                    <span className="text-sm text-slate-700 flex-1" style={{ fontWeight: 500 }}>{approver.name}</span>
                    <span className="flex items-center gap-1 text-xs text-green-700" style={{ fontWeight: 500 }}>
                      <CheckCircle size={12} /> {approver.action} · {approver.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Test results */}
          <div>
            <p className="text-xs text-slate-500 mb-3" style={{ fontWeight: 600 }}>Automated QA Results</p>
            <div className="space-y-2">
              {[
                { label: "Tone & Sentiment", score: item.qualityScore > 80 ? 91 : 65 },
                { label: "Grammar & Clarity", score: item.qualityScore > 80 ? 88 : 72 },
                { label: "Brand Alignment", score: item.qualityScore > 80 ? 84 : 58 },
                { label: "Safety Filters", score: 100 },
                { label: "Length Compliance", score: item.qualityScore > 80 ? 94 : 88 },
              ].map((test) => (
                <div key={test.label} className="flex items-center gap-3">
                  {test.score >= 70 ? <CheckCircle size={13} className="text-green-500 flex-shrink-0" /> : <XCircle size={13} className="text-red-500 flex-shrink-0" />}
                  <span className="text-xs text-slate-700 flex-1" style={{ fontWeight: 500 }}>{test.label}</span>
                  <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${test.score >= 80 ? "bg-green-500" : test.score >= 60 ? "bg-amber-500" : "bg-red-500"}`}
                      style={{ width: `${test.score}%` }}
                    />
                  </div>
                  <span className="text-xs w-6 text-right text-slate-600" style={{ fontWeight: 600 }}>{test.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <p className="text-xs text-slate-500 mb-2" style={{ fontWeight: 600 }}>Add Review Note</p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review notes or feedback..."
              rows={3}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50 flex-shrink-0">
          <button
            onClick={() => { toast.error(`${item.id} has been rejected.`); onClose(); }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors text-sm"
            style={{ fontWeight: 600 }}
          >
            <XCircle size={15} /> Reject
          </button>
          <button
            onClick={() => { toast.success(`${item.id} approved and advanced to next stage!`); onClose(); }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-sm shadow-sm"
            style={{ fontWeight: 600 }}
          >
            <CheckCircle size={15} /> Approve & Advance
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ApprovalWorkflow() {
  const [selectedItem, setSelectedItem] = useState<typeof approvalItems[0] | null>(null);
  const [filter, setFilter] = useState("All");

  const filters = ["All", "High", "Medium", "Low"];
  const filtered = filter === "All" ? approvalItems : approvalItems.filter((i) => i.risk === filter);

  return (
    <div className="p-6 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-slate-900 mb-1">Approval Workflow</h1>
          <p className="text-sm text-slate-500">
            Review and approve pending change requests · {approvalItems.length} awaiting action
          </p>
        </div>
        <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs rounded-md transition-all ${filter === f ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-700"}`}
              style={{ fontWeight: filter === f ? 600 : 500 }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Stage Pipeline Overview */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6 flex items-center gap-6 overflow-x-auto" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <p className="text-xs text-slate-500 flex-shrink-0" style={{ fontWeight: 600 }}>PIPELINE:</p>
        {stageFlow.map((stage, i) => {
          const count = approvalItems.filter((item) => item.stage === stage).length;
          return (
            <div key={stage} className="flex items-center gap-3">
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className={`px-4 py-2 rounded-lg text-xs ${count > 0 ? "bg-indigo-50 text-indigo-700 border border-indigo-200" : "bg-slate-50 text-slate-500 border border-slate-200"}`} style={{ fontWeight: 600 }}>
                  {stage}
                  {count > 0 && (
                    <span className="ml-2 bg-indigo-600 text-white text-xs w-5 h-5 rounded-full inline-flex items-center justify-center" style={{ fontSize: "10px" }}>
                      {count}
                    </span>
                  )}
                </div>
              </div>
              {i < stageFlow.length - 1 && <ChevronRight size={16} className="text-slate-300 flex-shrink-0" />}
            </div>
          );
        })}
      </div>

      {/* Items */}
      <div className="space-y-4">
        {filtered.map((item, idx) => {
          const risk = riskConfig[item.risk];
          const priority = priorityConfig[item.priority];
          const stageIdx = stageFlow.indexOf(item.stage);

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-slate-300 hover:shadow-md transition-all duration-200 cursor-pointer"
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
              onClick={() => setSelectedItem(item)}
            >
              <div className="flex items-center gap-5 px-6 py-5">
                {/* Left: QA Score */}
                <QualityMeter score={item.qualityScore} />

                {/* Center: Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs text-slate-400 font-mono" style={{ fontWeight: 600 }}>{item.id}</span>
                    {item.risk === "High" && <AlertTriangle size={13} className="text-red-500" />}
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${risk.bg} ${risk.text} ${risk.border}`} style={{ fontWeight: 500 }}>
                      {item.risk} Risk
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${priority.bg} ${priority.text}`} style={{ fontWeight: 500 }}>
                      {item.priority} Priority
                    </span>
                  </div>
                  <p className="text-slate-900 mb-2" style={{ fontWeight: 600, fontSize: "15px" }}>{item.title}</p>

                  {/* Stage Progress */}
                  <div className="flex items-center gap-1 mb-3">
                    {stageFlow.map((s, i) => (
                      <div key={s} className="flex items-center gap-1">
                        <div
                          className={`h-1.5 rounded-full transition-all ${i <= stageIdx ? "bg-indigo-500" : "bg-slate-200"}`}
                          style={{ width: i === stageIdx ? "48px" : "24px" }}
                        />
                      </div>
                    ))}
                    <span className="ml-2 text-xs text-slate-500" style={{ fontWeight: 500 }}>{item.stage}</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${item.requestedBy.color}`} style={{ fontWeight: 700, fontSize: "10px" }}>
                        {item.requestedBy.initials}
                      </div>
                      {item.requestedBy.name}
                    </span>
                    <span className="flex items-center gap-1"><Calendar size={11} /> Due {item.dueDate}</span>
                    <span className="flex items-center gap-1"><Clock size={11} /> Submitted {item.submittedDate}</span>
                    <span className="flex items-center gap-1">
                      <FileText size={11} />
                      {item.testsPassed}/{item.testsTotal} tests
                    </span>
                  </div>

                  {/* Previous approvers */}
                  {item.previousApprovers.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-slate-400">Approved by:</span>
                      {item.previousApprovers.map((a, i) => (
                        <div
                          key={i}
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${a.color} ring-2 ring-white`}
                          style={{ fontWeight: 700, fontSize: "9px" }}
                          title={a.name}
                        >
                          {a.initials}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); toast.info(`Opening thread for ${item.id}`); }}
                    className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                    title="Comments"
                  >
                    <MessageSquare size={16} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); toast.error(`${item.id} rejected.`); }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-sm border border-red-200 transition-colors"
                    style={{ fontWeight: 600 }}
                  >
                    <XCircle size={14} /> Reject
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); toast.success(`${item.id} approved!`); }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-sm shadow-sm transition-colors"
                    style={{ fontWeight: 600 }}
                  >
                    <CheckCircle size={14} /> Approve
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center py-20">
            <CheckCircle size={40} className="text-slate-200 mb-4" />
            <p className="text-slate-700 mb-1" style={{ fontWeight: 600 }}>No pending approvals</p>
            <p className="text-sm text-slate-400">All {filter !== "All" ? filter.toLowerCase() + " risk" : ""} items have been reviewed.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <ApprovalDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
