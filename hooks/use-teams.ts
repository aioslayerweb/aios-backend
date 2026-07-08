"use client"

import { useOrganizationIntelligenceContext } from "@/contexts/organization-intelligence-context"

export function useTeams() {
  const { teams, filteredTeams, selectedTeam, selectedTeamId, setSelectedTeamId } = useOrganizationIntelligenceContext()

  return {
    teams,
    filteredTeams,
    selectedTeam,
    selectedTeamId,
    setSelectedTeamId,
  }
}