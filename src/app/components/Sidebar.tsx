import { NavLink, useLocation } from "react-router";
import {
  LayoutDashboard,
  FolderOpen,
  GitBranch,
  GitPullRequest,
  CheckSquare,
  BarChart3,
  ScrollText,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/projects", label: "Content Projects", icon: FolderOpen },
  { to: "/prompt-versions", label: "Prompt Versions", icon: GitBranch },
  { to: "/change-requests", label: "Change Requests", icon: GitPullRequest },
  { to: "/approval-workflow", label: "Approval Workflow", icon: CheckSquare },
  { to: "/quality-reports", label: "Quality Reports", icon: BarChart3 },
  { to: "/audit-logs", label: "Audit Logs", icon: ScrollText },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  const isActive = (to: string, exact?: boolean) => {
    if (exact) return location.pathname === to;
    return location.pathname === to || location.pathname.startsWith(to + "/");
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="relative flex-shrink-0 bg-white border-r border-slate-200 flex flex-col overflow-hidden z-20"
      style={{ height: "100%" }}
    >
      {/* Logo */}
      <div className="flex items-center h-14 px-4 border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center flex-shrink-0 shadow-sm">
            <Shield size={14} className="text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                className="text-slate-900 whitespace-nowrap overflow-hidden"
                style={{ fontWeight: 700, fontSize: "15px", letterSpacing: "-0.01em" }}
              >
                QC Manager
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const active = isActive(item.to, item.exact);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              title={collapsed ? item.label : undefined}
              className={`
                relative flex items-center gap-3 rounded-lg transition-all duration-150 group
                ${collapsed ? "px-2 py-2 justify-center" : "px-3 py-2"}
                ${active
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}
              `}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-600 rounded-r-full" />
              )}
              <item.icon
                size={18}
                className={`flex-shrink-0 transition-colors ${active ? "text-indigo-600" : "text-slate-500 group-hover:text-slate-700"}`}
              />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-sm whitespace-nowrap overflow-hidden"
                    style={{ fontWeight: active ? 600 : 500 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="px-2 py-3 border-t border-slate-200 flex-shrink-0">
        <button
          onClick={onToggle}
          className={`
            w-full flex items-center rounded-lg px-2 py-2 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors
            ${collapsed ? "justify-center" : "gap-3"}
          `}
        >
          {collapsed ? (
            <ChevronRight size={16} />
          ) : (
            <>
              <ChevronLeft size={16} />
              <span className="text-sm" style={{ fontWeight: 500 }}>Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
