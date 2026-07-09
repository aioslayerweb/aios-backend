import type { TestCaseDefinition, TestLayer, TestPriority } from "@/tests/shared"

const defaultOwner = {
  team: "quality-engineering",
  role: "maintainer",
}

type BuildTestCaseInput = {
  id: string
  name: string
  description: string
  layer: TestLayer
  priority?: TestPriority
  tags?: string[]
}

export function buildTestCase(input: BuildTestCaseInput): TestCaseDefinition {
  return {
    id: input.id,
    name: input.name,
    description: input.description,
    layer: input.layer,
    priority: input.priority ?? "medium",
    owner: defaultOwner,
    tags: input.tags ?? [],
    status: "planned",
  }
}
