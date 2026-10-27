import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { test } from "node:test"
import { formatDemoEuro } from "@/lib/demo/currency"
import { answerDemoQuestion, demoDepartmentSummaries } from "@/lib/demo/executive-command-center-model"

const projectRoot = process.cwd()
const componentPath = join(projectRoot, "components/demo/executive-command-center-demo.tsx")
const cityComponentPath = join(projectRoot, "components/demo/department-cities.tsx")
const homeRoutePath = join(projectRoot, "app/demo-platform/page.tsx")
const executiveRoutePath = join(projectRoot, "app/demo-platform/executive/page.tsx")
const demoLayoutPath = join(projectRoot, "app/demo-platform/layout.tsx")
const authSessionProviderPath = join(projectRoot, "providers/auth-session-provider.tsx")

test("demo executive routes use the canonical synthetic command center", async () => {
  const [homeRoute, executiveRoute] = await Promise.all([
    readFile(homeRoutePath, "utf8"),
    readFile(executiveRoutePath, "utf8"),
  ])

  assert.match(homeRoute, /DemoExecutiveCommandCenter/)
  assert.match(executiveRoute, /DemoExecutiveCommandCenter/)
  assert.doesNotMatch(homeRoute, /executive-command-center\/executive-command-center["']/)
})

test("synthetic command center has deterministic local fixtures and no live data imports", async () => {
  const component = await readFile(componentPath, "utf8")

  assert.doesNotMatch(component, /Math\.random/)
  assert.doesNotMatch(component, /(?:supabase|runtime-live-context|executive-workspace-context|useBusinessMetrics)/i)
  assert.doesNotMatch(component, /\bfetch\s*\(/)
  assert.match(component, /Sample network/)
  assert.match(component, /deterministic demo assistant/)
  assert.match(component, /No prompt or business data is sent/)
  assert.match(component, /flex-col items-start gap-2 sm:flex-row/)
})

test("department city scene stays local and retains accessible fallbacks", async () => {
  const cityComponent = await readFile(cityComponentPath, "utf8")

  assert.doesNotMatch(cityComponent, /(?:supabase|runtime-live-context|useBusinessMetrics)/i)
  assert.doesNotMatch(cityComponent, /\b(?:fetch|XMLHttpRequest|WebSocket)\s*\(/)
  assert.doesNotMatch(cityComponent, /https?:\/\//)
  assert.match(cityComponent, /void import\("three"\)/)
  assert.match(cityComponent, /prefers-reduced-motion/)
  assert.match(cityComponent, /aria-label="Select a synthetic business department"/)
  assert.match(cityComponent, /3D rendering is unavailable in this browser/)
  assert.match(cityComponent, /resizeObserver\?\.disconnect\(\)/)
  assert.match(cityComponent, /intersectionObserver\?\.disconnect\(\)/)
  assert.match(cityComponent, /pointercancel/)
})

test("public demo disables Auth.js session polling without changing the app default", async () => {
  const [demoLayout, authSessionProvider, appProviders] = await Promise.all([
    readFile(demoLayoutPath, "utf8"),
    readFile(authSessionProviderPath, "utf8"),
    readFile(join(projectRoot, "providers/app-providers.tsx"), "utf8"),
  ])

  assert.match(demoLayout, /authSessionEnabled=\{false\}/)
  assert.match(authSessionProvider, /if \(!enabled\)/)
  assert.match(authSessionProvider, /SessionContext\.Provider value=\{disabledSession\}/)
  assert.match(authSessionProvider, /<SessionProvider/)
  assert.match(appProviders, /authSessionEnabled = true/)
})

test("demo currency formatter uses German EUR formatting", () => {
  assert.equal(formatDemoEuro(1234.56), "1.234,56\u00a0€")
  assert.match(formatDemoEuro(24800000, true), /^24,8\sMio\.\s€$/)
})

test("executive demo financial surfaces use the EUR formatter and synthetic labels", async () => {
  const component = await readFile(componentPath, "utf8")

  assert.match(component, /formatDemoEuro\(value, true\)/)
  assert.match(component, /formatDemoEuro\(pipelineAmounts\[item\.stage\] \?\? item\.amount, true\)/)
  assert.match(component, /formatDemoEuro\(opportunity\.amount, true\)/)
  assert.doesNotMatch(component, /\$\s?\d/)
  assert.doesNotMatch(component, /Global Marine|Skyline Aviation|Northwind Logistics|BetaTech Industries/)
  assert.match(component, /Sample Opportunity A/)
  assert.match(component, /Sample Account A/)
})

test("demo assistant answers from current synthetic values and links to a demo route", () => {
  const context = {
    revenueEur: 24_800_000,
    pipelineEur: 37_600_000,
    activeCustomers: 642,
    atRiskCustomers: 23,
    selectedDepartment: "Sales",
    selectedDepartmentFocus: "Pipeline acceleration",
  }

  const pipelineAnswer = answerDemoQuestion("What is the pipeline bottleneck?", context)
  assert.match(pipelineAnswer.summary, /37,6\sMio\.\s€/)
  assert.equal(pipelineAnswer.href, "/demo-platform/sales-intelligence")
  assert.match(pipelineAnswer.evidence, /estimates/)

  const riskAnswer = answerDemoQuestion("Why are accounts at risk?", context)
  assert.match(riskAnswer.summary, /23 accounts/)
  assert.match(riskAnswer.summary, /not calibrated churn probabilities/)
  assert.equal(riskAnswer.href, "/demo-platform/customer-intelligence")
})

test("department intelligence is synthetic and routes within the public demo", () => {
  assert.equal(demoDepartmentSummaries.length, 6)
  assert.ok(demoDepartmentSummaries.every((department) => department.href.startsWith("/demo-platform/")))
  assert.ok(demoDepartmentSummaries.every((department) => /sample|synthetic/i.test(`${department.kpi} ${department.issue} ${department.recommendation}`)))
})

test("department city selection opens one synchronized, dismissible department card", async () => {
  const [component, cityComponent, builders, css] = await Promise.all([
    readFile(componentPath, "utf8"),
    readFile(cityComponentPath, "utf8"),
    readFile(join(projectRoot, "components/demo/department-city-builders.ts"), "utf8"),
    readFile(join(projectRoot, "styles/foundation.css"), "utf8"),
  ])

  // Single authoritative selection drives both the city emphasis and the card.
  assert.match(component, /onDepartmentSelect=\{handleDepartmentSelect\}/)
  assert.match(component, /selectedDepartmentId=\{departmentCardOpen \? selectedDomainId : ""\}/)
  assert.match(component, /aria-labelledby="department-card-heading"/)
  assert.match(component, /Close \$\{selectedDomain\.label\} department card/)
  assert.match(component, /event\.key === "Escape"/)
  assert.equal((component.match(/aria-labelledby="department-card-heading"/g) ?? []).length, 1)

  // Every department rendered by the scene has a builder and a selection hit target.
  for (const id of ["sales", "marketing", "customers", "finance", "operations", "product"]) {
    assert.match(builders, new RegExp(`\\b${id}: \\(k\\)`))
    assert.ok(demoDepartmentSummaries.some((summary) => summary.id === id), `${id} has a department summary`)
  }
  assert.match(cityComponent, /hitTarget\.userData\.targetId = department\.id/)
  assert.match(cityComponent, /aria-pressed=\{selected\}/)

  // Only the selected city is emphasised; reduced motion applies it immediately.
  assert.match(cityComponent, /emphasis\.target = id === selectedId \? 1 : 0/)
  assert.match(cityComponent, /if \(reducedMotion\) stepEmphasis\(true\)/)

  // Marketing is calm and Finance is lifted out of near-black.
  assert.match(builders, /marketing: \(k\) => \{[\s\S]*?k\.setSpeed\(0\.2\)/)
  assert.doesNotMatch(builders, /0x090d16/)

  // The desktop card must stay visible, and the mobile card must be a safe-area bottom sheet.
  assert.doesNotMatch(css, /aios-demo-city-detail/)
  assert.match(css, /section\.aios-demo-department-card\[aria-labelledby\] \{[^}]*position: fixed[^}]*safe-area-inset-bottom/)
})
