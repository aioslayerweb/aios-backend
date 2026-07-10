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
  OrganizationSummaryStrip,
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

const headerActions: WorkspaceAction[] = [
  { id: "new", label: "New Team", icon: <Plus size={14} />, tone: "primary", onClick: () => undefined },
  { id: "structure", label: "Org Structure", icon: <Building2 size={14} />, tone: "secondary", onClick: () => undefined },
  { id: "directory", label: "People Directory", icon: <Users size={14} />, tone: "secondary", onClick: () => undefined },
  { id: "analytics", label: "Analytics", icon: <BarChart3 size={14} />, tone: "secondary", onClick: () => undefined },
];

export function OrganizationCenterWorkspace() {
  const [searchValue, setSearchValue] = useState("");
  const [peopleQuery, setPeopleQuery] = useState("");

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
        breadcrumbs={[{ label: "AIOS", href: "/app" }, { label: "Organization Center" }]}
        actions={headerActions}
        searchValue={searchValue}
        onSearch={setSearchValue}
      />

      <WorkspaceGrid className="xl:grid-cols-[280px_minmax(0,1fr)_360px]">
        <OrganizationLeftRail sections={orgSidebarSections} />

        <main className="space-y-4" aria-label="Organization center main panel">
          <OrganizationSummaryStrip metrics={organizationOverviewMetrics} />

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

        <RightInsightPanel insights={rightInsights} />
      </WorkspaceGrid>
    </WorkspaceShell>
  );
}
