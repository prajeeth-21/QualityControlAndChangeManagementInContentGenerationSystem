import { useState } from "react";
import {
  Settings as SettingsIcon,
  GitBranch,
  BarChart3,
  Plug,
  Users,
  Save,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

type Tab = "workflow" | "approval" | "quality" | "integrations" | "roles";

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "workflow", label: "Workflow Rules", icon: GitBranch },
  { id: "approval", label: "Approval Matrix", icon: SettingsIcon },
  { id: "quality", label: "Quality Metrics", icon: BarChart3 },
  { id: "integrations", label: "Integration Settings", icon: Plug },
  { id: "roles", label: "User Roles & Permissions", icon: Users },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${checked ? "bg-indigo-600" : "bg-slate-200"}`}
    >
      <motion.div
        animate={{ x: checked ? 18 : 2 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
      />
    </button>
  );
}

function WorkflowTab() {
  const [settings, setSettings] = useState({
    autoAssign: true,
    requireApproval: true,
    parallelReview: false,
    notifySlack: true,
    autoReject: false,
    stagingRequired: true,
    draftExpiry: "30",
    maxCycleTime: "14",
    minReviewers: "2",
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="text-slate-800">Workflow Automation</h3>
          <p className="text-xs text-slate-500 mt-0.5">Configure automatic behaviors in the change request lifecycle.</p>
        </div>
        <div className="divide-y divide-slate-100">
          {[
            { key: "autoAssign", label: "Auto-assign reviewers", desc: "Automatically assign reviewers based on content project and expertise" },
            { key: "requireApproval", label: "Require approval before deployment", desc: "All change requests must be approved before deploying to production" },
            { key: "parallelReview", label: "Enable parallel review", desc: "Allow multiple reviewers to review simultaneously instead of sequentially" },
            { key: "notifySlack", label: "Slack notifications", desc: "Send real-time notifications to configured Slack channels" },
            { key: "autoReject", label: "Auto-reject on QA failure", desc: "Automatically reject change requests that fail automated QA checks" },
            { key: "stagingRequired", label: "Staging environment required", desc: "Require all changes to pass staging validation before production" },
          ].map((item) => (
            <div key={item.key} className="flex items-start justify-between px-6 py-4">
              <div>
                <p className="text-sm text-slate-800" style={{ fontWeight: 500 }}>{item.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
              </div>
              <Toggle
                checked={settings[item.key as keyof typeof settings] as boolean}
                onChange={(v) => setSettings((s) => ({ ...s, [item.key]: v }))}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="text-slate-800">Timing & Thresholds</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { key: "draftExpiry", label: "Draft expiry (days)", desc: "Auto-expire stale drafts after N days", unit: "days" },
            { key: "maxCycleTime", label: "Max cycle time (days)", desc: "SLA target for completing a change request", unit: "days" },
            { key: "minReviewers", label: "Minimum reviewers", desc: "Minimum approvers required before advancing", unit: "people" },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-sm text-slate-700 mb-1" style={{ fontWeight: 500 }}>{field.label}</label>
              <p className="text-xs text-slate-400 mb-2">{field.desc}</p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={settings[field.key as keyof typeof settings] as string}
                  onChange={(e) => setSettings((s) => ({ ...s, [field.key]: e.target.value }))}
                  className="w-24 px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
                <span className="text-xs text-slate-400">{field.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ApprovalTab() {
  const [matrix] = useState([
    { role: "Junior Reviewer", canApprove: ["Draft → Review"], canDeploy: false, maxRisk: "Low" },
    { role: "Senior Reviewer", canApprove: ["Draft → Review", "Review → QA"], canDeploy: false, maxRisk: "Medium" },
    { role: "QA Engineer", canApprove: ["QA → Approved"], canDeploy: false, maxRisk: "High" },
    { role: "Team Lead", canApprove: ["All stages"], canDeploy: true, maxRisk: "High" },
    { role: "Admin", canApprove: ["All stages"], canDeploy: true, maxRisk: "High" },
  ]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div>
            <h3 className="text-slate-800">Role-Based Approval Matrix</h3>
            <p className="text-xs text-slate-500 mt-0.5">Define which roles can approve at each workflow stage.</p>
          </div>
          <button
            onClick={() => toast.info("Opening role configuration...")}
            className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
            style={{ fontWeight: 500 }}
          >
            <Plus size={14} /> Add Role
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left px-6 py-3 text-xs text-slate-500" style={{ fontWeight: 600 }}>Role</th>
              <th className="text-left px-6 py-3 text-xs text-slate-500" style={{ fontWeight: 600 }}>Can Approve</th>
              <th className="text-left px-6 py-3 text-xs text-slate-500" style={{ fontWeight: 600 }}>Max Risk Level</th>
              <th className="text-left px-6 py-3 text-xs text-slate-500" style={{ fontWeight: 600 }}>Deploy Access</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-900" style={{ fontWeight: 500 }}>{row.role}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {row.canApprove.map((stage) => (
                      <span key={stage} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full" style={{ fontWeight: 500 }}>{stage}</span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full ${row.maxRisk === "Low" ? "bg-green-50 text-green-700" : row.maxRisk === "Medium" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"}`} style={{ fontWeight: 500 }}>
                    {row.maxRisk}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {row.canDeploy
                    ? <CheckCircle size={16} className="text-green-500" />
                    : <AlertCircle size={16} className="text-slate-300" />
                  }
                </td>
                <td className="px-6 py-4">
                  <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function QualityTab() {
  const [thresholds, setThresholds] = useState({
    minQualityScore: "75",
    toneScore: "80",
    grammarScore: "85",
    safetyScore: "100",
    brandScore: "70",
    autoPassThreshold: "90",
    autoFailThreshold: "50",
  });

  const [toggles, setToggles] = useState({
    autoQA: true,
    blockOnFail: true,
    sendReport: true,
    compareBaseline: false,
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="text-slate-800">Quality Score Thresholds</h3>
          <p className="text-xs text-slate-500 mt-0.5">Set minimum passing scores for each quality dimension.</p>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { key: "minQualityScore", label: "Overall Minimum Score", desc: "Global floor for all prompts" },
            { key: "toneScore", label: "Tone & Sentiment Min.", desc: "Emotional tone alignment threshold" },
            { key: "grammarScore", label: "Grammar & Clarity Min.", desc: "Language quality requirement" },
            { key: "safetyScore", label: "Safety Filter Min.", desc: "Content safety — must be 100 for Prod" },
            { key: "brandScore", label: "Brand Alignment Min.", desc: "On-brand voice compliance" },
            { key: "autoPassThreshold", label: "Auto-pass Threshold", desc: "Score above which changes auto-approve" },
            { key: "autoFailThreshold", label: "Auto-fail Threshold", desc: "Score below which changes auto-reject" },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-sm text-slate-700 mb-1" style={{ fontWeight: 500 }}>{field.label}</label>
              <p className="text-xs text-slate-400 mb-2">{field.desc}</p>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={thresholds[field.key as keyof typeof thresholds]}
                  onChange={(e) => setThresholds((t) => ({ ...t, [field.key]: e.target.value }))}
                  className="flex-1 accent-indigo-600"
                />
                <span
                  className={`w-10 text-center text-sm rounded-lg px-1 py-0.5 ${parseInt(thresholds[field.key as keyof typeof thresholds]) >= 80 ? "bg-green-50 text-green-700" : parseInt(thresholds[field.key as keyof typeof thresholds]) >= 60 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"}`}
                  style={{ fontWeight: 700 }}
                >
                  {thresholds[field.key as keyof typeof thresholds]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="text-slate-800">Automated QA Settings</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {[
            { key: "autoQA", label: "Run automated QA on submission", desc: "Automatically trigger QA checks when a version is submitted for review" },
            { key: "blockOnFail", label: "Block advancement on QA failure", desc: "Prevent change requests from advancing if automated checks fail" },
            { key: "sendReport", label: "Email QA report to requestor", desc: "Send detailed QA results to the change request author" },
            { key: "compareBaseline", label: "Compare against baseline version", desc: "Automatically compare new versions against the current approved version" },
          ].map((item) => (
            <div key={item.key} className="flex items-start justify-between px-6 py-4">
              <div>
                <p className="text-sm text-slate-800" style={{ fontWeight: 500 }}>{item.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
              </div>
              <Toggle
                checked={toggles[item.key as keyof typeof toggles]}
                onChange={(v) => setToggles((t) => ({ ...t, [item.key]: v }))}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function IntegrationsTab() {
  const integrations = [
    { name: "Slack", desc: "Send notifications to Slack channels", status: "Connected", icon: "💬", color: "bg-purple-50 border-purple-200" },
    { name: "GitHub", desc: "Sync prompt versions with Git repositories", status: "Connected", icon: "🐙", color: "bg-slate-50 border-slate-200" },
    { name: "Jira", desc: "Link change requests to Jira tickets", status: "Disconnected", icon: "🎯", color: "bg-blue-50 border-blue-200" },
    { name: "PagerDuty", desc: "Alert on-call when critical QC failures occur", status: "Disconnected", icon: "🚨", color: "bg-red-50 border-red-200" },
    { name: "DataDog", desc: "Monitor prompt performance and quality metrics", status: "Connected", icon: "📊", color: "bg-amber-50 border-amber-200" },
    { name: "OpenAI API", desc: "Connect to GPT models for automated testing", status: "Connected", icon: "🤖", color: "bg-green-50 border-green-200" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((integration) => (
          <div key={integration.name} className={`bg-white rounded-xl border p-5 flex items-start gap-4 hover:shadow-md transition-all ${integration.color}`} style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div className="text-2xl flex-shrink-0">{integration.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm text-slate-900" style={{ fontWeight: 600 }}>{integration.name}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${integration.status === "Connected" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`} style={{ fontWeight: 500 }}>
                  {integration.status}
                </span>
              </div>
              <p className="text-xs text-slate-500">{integration.desc}</p>
            </div>
            <button
              onClick={() => toast.info(`${integration.status === "Connected" ? "Disconnecting" : "Connecting"} ${integration.name}...`)}
              className={`text-xs px-3 py-1.5 rounded-lg transition-colors flex-shrink-0 ${integration.status === "Connected" ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
              style={{ fontWeight: 500 }}
            >
              {integration.status === "Connected" ? "Manage" : "Connect"}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <h3 className="text-slate-800 mb-4">Webhook Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-700 mb-2" style={{ fontWeight: 500 }}>Webhook URL</label>
            <input
              type="url"
              defaultValue="https://hooks.example.com/qcmanager/events"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-700 mb-2" style={{ fontWeight: 500 }}>Events to send</label>
            <div className="flex flex-wrap gap-2">
              {["approval.created", "approval.approved", "approval.rejected", "deployment.success", "deployment.failed", "qc.passed", "qc.failed"].map((event) => (
                <label key={event} className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 cursor-pointer hover:bg-slate-100">
                  <input type="checkbox" defaultChecked className="accent-indigo-600" />
                  <code>{event}</code>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RolesTab() {
  const users = [
    { name: "Sarah Chen", email: "sarah.chen@co.com", role: "Admin", initials: "SC", color: "bg-indigo-500", status: "Active" },
    { name: "James Park", email: "james.park@co.com", role: "Senior Reviewer", initials: "JP", color: "bg-blue-500", status: "Active" },
    { name: "Leila Nouri", email: "leila.nouri@co.com", role: "QA Engineer", initials: "LN", color: "bg-purple-500", status: "Active" },
    { name: "Mike Torres", email: "mike.torres@co.com", role: "Team Lead", initials: "MT", color: "bg-green-500", status: "Active" },
    { name: "Anna Kim", email: "anna.kim@co.com", role: "Junior Reviewer", initials: "AK", color: "bg-rose-500", status: "Active" },
    { name: "David Lee", email: "david.lee@co.com", role: "Junior Reviewer", initials: "DL", color: "bg-amber-500", status: "Active" },
    { name: "Rachel Wong", email: "rachel.wong@co.com", role: "Senior Reviewer", initials: "RW", color: "bg-cyan-500", status: "Inactive" },
  ];

  const roleColors: Record<string, string> = {
    Admin: "bg-red-50 text-red-700",
    "Team Lead": "bg-indigo-50 text-indigo-700",
    "QA Engineer": "bg-amber-50 text-amber-700",
    "Senior Reviewer": "bg-blue-50 text-blue-700",
    "Junior Reviewer": "bg-slate-100 text-slate-600",
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h3 className="text-slate-800">Team Members</h3>
            <p className="text-xs text-slate-500 mt-0.5">{users.length} members in your workspace</p>
          </div>
          <button
            onClick={() => toast.info("Opening user invitation form...")}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition-colors shadow-sm"
            style={{ fontWeight: 600 }}
          >
            <Plus size={14} /> Invite User
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left px-6 py-3 text-xs text-slate-500" style={{ fontWeight: 600 }}>User</th>
              <th className="text-left px-6 py-3 text-xs text-slate-500" style={{ fontWeight: 600 }}>Role</th>
              <th className="text-left px-6 py-3 text-xs text-slate-500" style={{ fontWeight: 600 }}>Status</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs shadow-sm ${user.color}`} style={{ fontWeight: 700 }}>
                      {user.initials}
                    </div>
                    <div>
                      <p className="text-sm text-slate-900" style={{ fontWeight: 500 }}>{user.name}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full ${roleColors[user.role] || "bg-slate-100 text-slate-600"}`} style={{ fontWeight: 500 }}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`flex items-center gap-1.5 text-xs ${user.status === "Active" ? "text-green-600" : "text-slate-400"}`} style={{ fontWeight: 500 }}>
                    <span className={`w-1.5 h-1.5 rounded-full ${user.status === "Active" ? "bg-green-500" : "bg-slate-300"}`} />
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-xs text-slate-500 hover:text-indigo-600 transition-colors" style={{ fontWeight: 500 }}>
                    Edit Role
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Settings() {
  const [activeTab, setActiveTab] = useState<Tab>("workflow");

  const tabContent: Record<Tab, React.ReactNode> = {
    workflow: <WorkflowTab />,
    approval: <ApprovalTab />,
    quality: <QualityTab />,
    integrations: <IntegrationsTab />,
    roles: <RolesTab />,
  };

  return (
    <div className="p-6 max-w-[1440px] mx-auto">
      <div className="mb-6">
        <h1 className="text-slate-900 mb-1">Settings</h1>
        <p className="text-sm text-slate-500">Configure your workspace, approval rules, quality thresholds, and integrations.</p>
      </div>

      <div className="flex gap-6">
        {/* Left Tabs */}
        <div className="w-52 flex-shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 p-2" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${activeTab === tab.id ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"}`}
              >
                <tab.icon size={16} className={activeTab === tab.id ? "text-indigo-600" : "text-slate-400"} />
                <span className="text-sm" style={{ fontWeight: activeTab === tab.id ? 600 : 500 }}>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {tabContent[activeTab]}
            </motion.div>
          </AnimatePresence>

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => toast.success("Settings saved successfully!")}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm transition-all shadow-sm"
              style={{ fontWeight: 600 }}
            >
              <Save size={15} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
