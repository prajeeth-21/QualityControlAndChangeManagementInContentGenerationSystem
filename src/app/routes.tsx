import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { ContentProjects } from "./pages/ContentProjects";
import { PromptVersions } from "./pages/PromptVersions";
import { ChangeRequests } from "./pages/ChangeRequests";
import { ApprovalWorkflow } from "./pages/ApprovalWorkflow";
import { QualityReports } from "./pages/QualityReports";
import { AuditLogs } from "./pages/AuditLogs";
import { Settings } from "./pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "projects", Component: ContentProjects },
      { path: "prompt-versions", Component: PromptVersions },
      { path: "change-requests", Component: ChangeRequests },
      { path: "approval-workflow", Component: ApprovalWorkflow },
      { path: "quality-reports", Component: QualityReports },
      { path: "audit-logs", Component: AuditLogs },
      { path: "settings", Component: Settings },
    ],
  },
]);
