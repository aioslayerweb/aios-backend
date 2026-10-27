import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { test } from "node:test"

const root = process.cwd()
const read = (path: string) => readFile(join(root, path), "utf8")

test("public homepage hero scene is deferred, frame-capped and static on software GL", async () => {
  const source = await read("components/public-site/spatial-neural-core.tsx")

  assert.match(source, /requestIdleCallback/)
  assert.match(source, /document\.readyState === "complete"/)
  assert.match(source, /FRAME_INTERVAL_MS = 1000 \/ 30/)
  assert.match(source, /swiftshader\|llvmpipe/)
  assert.match(source, /prefers-reduced-motion: reduce/)
  assert.match(source, /cancelIdleCallback/)
  assert.match(source, /IntersectionObserver/)
  assert.match(source, /import\("three"\)/)
})

test("shared AIOS components use lazily loaded framer-motion features", async () => {
  const layout = await read("app/layout.tsx")
  const provider = await read("components/aios/motion-provider.tsx")
  const features = await read("components/aios/motion-features.ts")

  assert.match(layout, /AIOSMotionProvider/)
  assert.match(provider, /LazyMotion/)
  assert.match(provider, /import\("@\/components\/aios\/motion-features"\)/)
  assert.match(features, /domAnimation/)

  for (const file of ["navigation", "backgrounds", "buttons", "hero", "sections", "timeline", "architecture"]) {
    const source = await read(`components/aios/${file}/index.tsx`)
    assert.doesNotMatch(source, /import \{[^}]*\bmotion\b[^}]*\} from "framer-motion"/, `${file} must import the slim m component`)
  }
  assert.doesNotMatch(await read("components/aios/compat.tsx"), /import \{[^}]*\bmotion\b[^}]*\} from "framer-motion"/)
})

test("homepage static content is server-rendered and interactive state stays in local islands", async () => {
  const homepage = await read("components/public-site/public-homepage-experience.tsx")
  const islands = await read("components/public-site/homepage-interactive-islands.tsx")
  const structuredData = await read("components/public-site/public-structured-data-server.tsx")
  const publicButton = await read("components/aios/buttons/index.tsx")

  assert.doesNotMatch(homepage, /^["']use client["']/m)
  assert.doesNotMatch(homepage, /\buseState\b|\buseEffect\b/)
  assert.match(homepage, /<HomeCockpitIsland \/>/)
  assert.match(homepage, /<HomeFlowIsland \/>/)
  assert.match(homepage, /<HomeRoleIsland \/>/)
  assert.match(homepage, /<HomeScenarioIsland \/>/)
  assert.match(islands, /export function HomeCockpitIsland/)
  assert.match(islands, /export function HomeFlowIsland/)
  assert.match(islands, /export function HomeRoleIsland/)
  assert.match(islands, /export function HomeScenarioIsland/)
  assert.equal((islands.match(/useState\(/g) ?? []).length, 5)
  assert.match(homepage, /public-structured-data-server/)
  assert.match(homepage, /href="\/demo-platform\/executive" prefetch=\{false\}/)
  assert.match(publicButton, /prefetch=\{href\.startsWith\("\/demo-platform"\) \? false : undefined\}/)
  assert.doesNotMatch(structuredData, /^["']use client["']/m)
})
