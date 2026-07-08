import type {
  GlobalSearchState,
  KnowledgeCollection,
  MemoryExplorerEntry,
  RelatedEntity,
  SearchDateFilter,
  SearchDepartment,
  SearchFilters,
  SearchPriority,
  SearchResult,
  SearchSourceKey,
} from "@/types"

const allSources: SearchSourceKey[] = [
  "memory",
  "knowledge",
  "customers",
  "companies",
  "contacts",
  "tasks",
  "executions",
  "runtime-events",
  "activity",
  "reports",
  "agents",
  "documents",
  "settings",
  "commands",
  "notifications",
  "vector-placeholder",
]

export const defaultSearchFilters: SearchFilters = {
  sources: allSources,
  date: "all",
  priorities: [],
  confidenceMin: 0,
  tags: [],
  departments: [],
}

export const defaultSuggestedSearches = [
  "Show customers at risk",
  "Find yesterday's executive summary",
  "Explain recent memory updates",
  "Find sales opportunities",
  "Summarize runtime failures",
]

function normalize(value: string): string {
  return value.trim().toLowerCase()
}

function fuzzySubsequence(query: string, target: string): boolean {
  if (!query) {
    return true
  }

  let q = 0
  for (let index = 0; index < target.length; index += 1) {
    if (target[index] === query[q]) {
      q += 1
    }
    if (q >= query.length) {
      return true
    }
  }

  return false
}

export function scoreSearchResult(result: SearchResult, query: string): number {
  if (!query.trim()) {
    return 1
  }

  const normalizedQuery = normalize(query)
  const title = normalize(result.title)
  const summary = normalize(result.summary)
  const tags = result.tags.map(normalize).join(" ")

  let score = 0

  if (title.includes(normalizedQuery)) {
    score += 60
  }

  if (summary.includes(normalizedQuery)) {
    score += 32
  }

  if (tags.includes(normalizedQuery)) {
    score += 26
  }

  if (fuzzySubsequence(normalizedQuery, `${title} ${summary} ${tags}`)) {
    score += 16
  }

  for (const token of normalizedQuery.split(/\s+/).filter(Boolean)) {
    if (title.includes(token)) {
      score += 14
    }
    if (summary.includes(token)) {
      score += 8
    }
    if (tags.includes(token)) {
      score += 6
    }
  }

  return score
}

function satisfiesDateFilter(timestamp: number, filter: SearchDateFilter): boolean {
  if (filter === "all") {
    return true
  }

  const age = Date.now() - timestamp

  if (filter === "24h") {
    return age <= 24 * 60 * 60 * 1000
  }

  if (filter === "7d") {
    return age <= 7 * 24 * 60 * 60 * 1000
  }

  return age <= 30 * 24 * 60 * 60 * 1000
}

export function applySearchFilters(results: SearchResult[], filters: SearchFilters, query: string): SearchResult[] {
  return results
    .filter((item) => {
      if (filters.sources.length > 0 && !filters.sources.includes(item.source)) {
        return false
      }

      if (!satisfiesDateFilter(item.timestamp, filters.date)) {
        return false
      }

      if (filters.priorities.length > 0 && !filters.priorities.includes(item.priority)) {
        return false
      }

      if (item.confidence < filters.confidenceMin) {
        return false
      }

      if (filters.tags.length > 0 && !filters.tags.every((tag) => item.tags.includes(tag))) {
        return false
      }

      if (filters.departments.length > 0 && !filters.departments.includes(item.department)) {
        return false
      }

      return scoreSearchResult(item, query) > 0
    })
    .sort((left, right) => {
      const scoreDiff = scoreSearchResult(right, query) - scoreSearchResult(left, query)
      if (scoreDiff !== 0) {
        return scoreDiff
      }
      return right.timestamp - left.timestamp
    })
}

export function searchHighlightParts(text: string, query: string): Array<{ text: string; match: boolean }> {
  const normalizedQuery = normalize(query)
  if (!normalizedQuery) {
    return [{ text, match: false }]
  }

  const lower = text.toLowerCase()
  const index = lower.indexOf(normalizedQuery)
  if (index === -1) {
    return [{ text, match: false }]
  }

  const before = text.slice(0, index)
  const match = text.slice(index, index + normalizedQuery.length)
  const after = text.slice(index + normalizedQuery.length)

  return [
    ...(before ? [{ text: before, match: false }] : []),
    { text: match, match: true },
    ...(after ? [{ text: after, match: false }] : []),
  ]
}

export function mockStaticSearchResults(): SearchResult[] {
  const now = Date.now()

  const factory = (
    id: string,
    title: string,
    summary: string,
    source: SearchSourceKey,
    category: string,
    confidence: number,
    priority: SearchPriority,
    department: SearchDepartment,
    tags: string[],
    offsetMs: number
  ): SearchResult => ({
    id,
    title,
    summary,
    source,
    category,
    confidence,
    timestamp: now - offsetMs,
    priority,
    tags,
    department,
    referenceId: id,
    metadata: {
      source,
      category,
    },
  })

  return [
    factory("cust-risk-1", "Customer risk: Axion Retail", "Revenue risk elevated after usage decline and delayed renewal signal.", "customers", "Customer", 88, "high", "sales", ["risk", "renewal"], 2_100_000),
    factory("company-1", "Company profile: Northstar Holdings", "Parent company profile updated with new business unit map.", "companies", "Company", 80, "medium", "executive", ["profile", "company"], 4_200_000),
    factory("contact-1", "Contact: Maya Chen", "Primary sponsor contact moved to strategic programs role.", "contacts", "Contact", 75, "medium", "sales", ["contact", "stakeholder"], 9_500_000),
    factory("report-1", "Executive summary report", "Yesterday's executive summary report generated and archived.", "reports", "Report", 91, "medium", "executive", ["summary", "executive"], 1_500_000),
    factory("doc-1", "Document: FY27 GTM Plan", "Go-to-market strategy document indexed with topic annotations.", "documents", "Document", 86, "medium", "marketing", ["strategy", "gtm"], 3_800_000),
    factory("setting-1", "Settings: Runtime preferences", "System runtime preferences include alert thresholds and escalation policies.", "settings", "Setting", 72, "low", "platform", ["settings", "runtime"], 12_000_000),
    factory("vector-1", "Vector similarity placeholder", "Future semantic embedding matches will surface here.", "vector-placeholder", "Vector", 65, "low", "platform", ["vector", "future"], 30_000_000),
  ]
}

export function mockKnowledgeCollections(): KnowledgeCollection[] {
  const now = Date.now()
  return [
    {
      id: "kc-1",
      name: "Executive Briefings",
      documents: 42,
      topics: ["board", "risk", "strategy"],
      pinned: true,
      updatedAt: now - 1_200_000,
    },
    {
      id: "kc-2",
      name: "Sales Intelligence",
      documents: 66,
      topics: ["pipeline", "opportunity", "forecast"],
      pinned: false,
      updatedAt: now - 4_800_000,
    },
    {
      id: "kc-3",
      name: "Operations Playbooks",
      documents: 31,
      topics: ["automation", "incident", "workflow"],
      pinned: true,
      updatedAt: now - 9_600_000,
    },
  ]
}

export function mockMemoryExplorerEntries(): MemoryExplorerEntry[] {
  const now = Date.now()
  return [
    {
      id: "me-1",
      lane: "working",
      title: "Working memory: escalation context",
      summary: "Latest support escalations and SLA signals for review.",
      pinned: false,
      updatedAt: now - 900_000,
    },
    {
      id: "me-2",
      lane: "session",
      title: "Session memory: executive priorities",
      summary: "Current leadership priorities from today's operating cadence.",
      pinned: true,
      updatedAt: now - 1_500_000,
    },
    {
      id: "me-3",
      lane: "long-term",
      title: "Long-term memory: customer lifecycle policy",
      summary: "Policy references for customer classification and risk transitions.",
      pinned: true,
      updatedAt: now - 5_700_000,
    },
  ]
}

export function mockRelatedEntities(seed: SearchResult | null): RelatedEntity[] {
  if (!seed) {
    return []
  }

  return [
    { id: `${seed.id}-customer`, type: "customer", label: "Related Customer" },
    { id: `${seed.id}-task`, type: "task", label: "Linked Task" },
    { id: `${seed.id}-execution`, type: "execution", label: "Execution Trace" },
    { id: `${seed.id}-memory`, type: "memory", label: "Memory Context" },
    { id: `${seed.id}-knowledge`, type: "knowledge", label: "Knowledge Topic" },
    { id: `${seed.id}-agent`, type: "agent", label: "Associated Agent" },
  ]
}

export function defaultGlobalSearchState(): Omit<GlobalSearchState, "results" | "filteredResults"> {
  return {
    query: "",
    filters: defaultSearchFilters,
    aiMode: false,
    loading: false,
    selectedResultId: null,
    bookmarks: [],
    recentSearches: [],
    knowledgeCollections: mockKnowledgeCollections(),
    memoryExplorer: mockMemoryExplorerEntries(),
    suggestedSearches: defaultSuggestedSearches,
  }
}
