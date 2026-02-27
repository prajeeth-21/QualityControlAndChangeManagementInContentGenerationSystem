import { useState } from "react";
import { Search, Bell, ChevronDown, Check, Circle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const environments = ["Dev", "Staging", "Prod"] as const;
type Env = (typeof environments)[number];

const envColors: Record<Env, string> = {
  Dev: "bg-blue-100 text-blue-700",
  Staging: "bg-amber-100 text-amber-700",
  Prod: "bg-red-100 text-red-700",
};

const notifications = [
  { id: 1, text: "CR-040 needs QA validation", time: "5 min ago", unread: true },
  { id: 2, text: "Sarah Chen approved CR-042", time: "12 min ago", unread: true },
  { id: 3, text: "Deployment failed: FAQ v3.9", time: "1h ago", unread: true },
  { id: 4, text: "New version submitted: SEO v3.5", time: "2h ago", unread: false },
  { id: 5, text: "CR-035 due in 24 hours", time: "3h ago", unread: false },
];

export function TopNav() {
  const [env, setEnv] = useState<Env>("Prod");
  const [showEnvMenu, setShowEnvMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center px-4 gap-4 flex-shrink-0 z-30 relative">
      {/* Search */}
      <div className={`flex-1 max-w-xl relative transition-all duration-200 ${searchFocused ? "max-w-2xl" : ""}`}>
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search prompts, versions, changes..."
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 bg-slate-100 rounded px-1.5 py-0.5 hidden sm:block">
          ⌘K
        </kbd>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowEnvMenu(false);
              setShowProfile(false);
            }}
            className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-sm text-slate-900" style={{ fontWeight: 600 }}>Notifications</span>
                  <span className="text-xs text-indigo-600 cursor-pointer hover:text-indigo-800" style={{ fontWeight: 500 }}>
                    Mark all read
                  </span>
                </div>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 flex items-start gap-3 hover:bg-slate-50 cursor-pointer transition-colors ${n.unread ? "bg-indigo-50/40" : ""}`}
                  >
                    <Circle
                      size={7}
                      className={`mt-1.5 flex-shrink-0 ${n.unread ? "fill-indigo-500 text-indigo-500" : "fill-slate-300 text-slate-300"}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700" style={{ fontWeight: n.unread ? 500 : 400 }}>{n.text}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Environment Selector */}
        <div className="relative">
          <button
            onClick={() => {
              setShowEnvMenu(!showEnvMenu);
              setShowNotifications(false);
              setShowProfile(false);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all border ${envColors[env]} border-transparent hover:opacity-80`}
            style={{ fontWeight: 600 }}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${env === "Prod" ? "bg-red-500" : env === "Staging" ? "bg-amber-500" : "bg-blue-500"}`} />
            {env}
            <ChevronDown size={13} />
          </button>
          <AnimatePresence>
            {showEnvMenu && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 py-1"
              >
                {environments.map((e) => (
                  <button
                    key={e}
                    onClick={() => { setEnv(e); setShowEnvMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors text-left"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${e === "Prod" ? "bg-red-500" : e === "Staging" ? "bg-amber-500" : "bg-blue-500"}`} />
                    <span className={`flex-1 text-sm ${envColors[e].split(" ")[1]}`} style={{ fontWeight: 500 }}>{e}</span>
                    {env === e && <Check size={13} className="text-indigo-500" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
              setShowEnvMenu(false);
            }}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
              <span className="text-white text-xs" style={{ fontWeight: 700 }}>SC</span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm text-slate-800" style={{ fontWeight: 600, lineHeight: 1.2 }}>Sarah Chen</p>
              <p className="text-xs text-slate-500" style={{ lineHeight: 1.2 }}>Admin</p>
            </div>
            <ChevronDown size={13} className="text-slate-400 hidden md:block" />
          </button>
          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm text-slate-900" style={{ fontWeight: 600 }}>Sarah Chen</p>
                  <p className="text-xs text-slate-500">sarah.chen@company.com</p>
                </div>
                <div className="py-1">
                  {["Profile Settings", "Team Workspace", "Keyboard Shortcuts", "Help & Support"].map((item) => (
                    <button key={item} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                      {item}
                    </button>
                  ))}
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      Sign out
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Backdrop */}
      {(showEnvMenu || showNotifications || showProfile) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setShowEnvMenu(false); setShowNotifications(false); setShowProfile(false); }}
        />
      )}
    </header>
  );
}
