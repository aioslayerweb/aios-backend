"use client";

import { useMemo, useState } from "react";
import { BarChart3, Building2, Plus, Users } from "lucide-react";
import {
  AIWorkforcePanel,
  BusinessUnitsGrid,
  DepartmentsGrid,
  OrganizationActivityTimeline,
  OrganizationChart,
  OrganizationHeader,
  OrganizationLeftRail,
  OrganizationOverview,
  OrganizationAnalytics,
  PeopleDirectory,
  PermissionsOverview,
  ResponsibilityMatrix,
  RightInsightPanel,
} from "./organization-center-components";
import {
  aiWorkforceMetrics,
  businessUnits,
  departmentRecords,
  orgSidebarSections,
  organizationActivity,
  organizationAnalytics,
  organizationChart,
  organizationOverviewMetrics,
  peopleDirectory,
  permissionLinks,
  permissionNodes,
  raciMatrix,
  rightInsights,
} from "./mock-data";
import { WorkspaceGrid, WorkspaceSection, WorkspaceShell } from "@/components/workspace";
import type { WorkspaceAction } from "@/components/workspace";
import { useNavigationBase } from "@/contexts/navigation-context";

export function OrganizationCenterWorkspace() {
  const [searchValue, setSearchValue] = useState("");
  const [peopleQuery, setPeopleQuery] = useState("");
  const [notice, setNotice] = useState("");
  const { baseHref } = useNavigationBase();
  const jumpTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const headerActions: WorkspaceAction[] = [
    { id: "new", label: "New Team", icon: <Plus size={14} />, tone: "primary", onClick: () => setNotice("Team creation is not connected. No organization data was changed.") },
    { id: "structure", label: "Org Structure", icon: <Building2 size={14} />, tone: "secondary", onClick: () => jumpTo("organization-chart") },
    { id: "directory", label: "People Directory", icon: <Users size={14} />, tone: "secondary", onClick: () => jumpTo("people-directory") },
    { id: "analytics", label: "Analytics", icon: <BarChart3 size={14} />, tone: "secondary", onClick: () => jumpTo("organization-analytics") },
  ];

  const filteredPeople = useMemo(() => {
    const query = peopleQuery.trim().toLowerCase();
    if (!query) return peopleDirectory;

    return peopleDirectory.filter((person) => {
      const haystack = [
        person.name,
        person.role,
        person.department,
        person.country,
        person.office,
        person.reportsTo,
        person.skills.join(" "),
        person.assignedAgents.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [peopleQuery]);

  const filteredDepartments = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return departmentRecords;
    return departmentRecords.filter((department) => {
      const haystack = [department.name, department.head, department.status, department.budget].join(" ").toLowerCase();
      return haystack.includes(query);
    });
  }, [searchValue]);

  return (
    <WorkspaceShell>
      <OrganizationHeader
        breadcrumbs={[{ label: "AIOS", href: baseHref }, { label: "Organization Center" }]}
        actions={headerActions}
        searchValue={searchValue}
        onSearch={setSearchValue}
      />
      {notice ? <p className="mb-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900" role="status" aria-live="polite">{notice}</p> : null}

      <WorkspaceGrid className="xl:grid-cols-[250px_minmax(0,1fr)] 3xl:grid-cols-[250px_minmax(0,1fr)_320px]">
        <OrganizationLeftRail sections={orgSidebarSections} />

        <main className="min-w-0 space-y-5" aria-label="Organization center main panel">
          <WorkspaceSection id="organization-overview" title="Organization Overview" subtitle="Employees, departments, business units, and reporting model" actionLabel="AIOS">
            <OrganizationOverview metrics={organizationOverviewMetrics} />
          </WorkspaceSection>

          <WorkspaceSection id="organization-chart" title="Interactive Organization Chart" subtitle="Hierarchy with AI agents and reporting relationships" actionLabel="AIOS">
            <OrganizationChart nodes={organizationChart} />
          </WorkspaceSection>

          <WorkspaceSection id="departments" title="Departments" subtitle="Department performance, health, and budget" actionLabel="AIOS">
            <DepartmentsGrid departments={filteredDepartments} />
          </WorkspaceSection>

          <WorkspaceSection id="business-units" title="Business Units" subtitle="Regional and operational business unit intelligence" actionLabel="AIOS">
            <BusinessUnitsGrid units={businessUnits} />
          </WorkspaceSection>

          <WorkspaceSection id="people-directory" title="People Directory" subtitle="Searchable workforce directory" actionLabel="AIOS">
            <PeopleDirectory employees={filteredPeople} query={peopleQuery} onQuery={setPeopleQuery} />
          </WorkspaceSection>

          <WorkspaceSection id="ai-workforce" title="AI Workforce" subtitle="Human and AI workforce structure" actionLabel="AIOS">
            <AIWorkforcePanel metrics={aiWorkforceMetrics} />
          </WorkspaceSection>

          <WorkspaceSection id="responsibility-matrix" title="Responsibility Matrix" subtitle="RACI ownership across business processes" actionLabel="AIOS">
            <ResponsibilityMatrix rows={raciMatrix} />
          </WorkspaceSection>

          <WorkspaceSection id="permissions-overview" title="Permissions Overview" subtitle="Roles, groups, capabilities, and compliance graph" actionLabel="AIOS">
            <PermissionsOverview nodes={permissionNodes} links={permissionLinks} />
          </WorkspaceSection>

          <WorkspaceSection id="organization-analytics" title="Organization Analytics" subtitle="Hiring, growth, attrition, and AI maturity" actionLabel="AIOS">
            <OrganizationAnalytics rows={organizationAnalytics} />
          </WorkspaceSection>

          <WorkspaceSection id="activity-timeline" title="Activity Timeline" subtitle="Organizational events and updates" actionLabel="AIOS">
            <OrganizationActivityTimeline events={organizationActivity} />
          </WorkspaceSection>
        </main>

        <RightInsightPanel className="xl:col-span-2 3xl:col-span-1" insights={rightInsights} />
      </WorkspaceGrid>
    </WorkspaceShell>
  );
}
