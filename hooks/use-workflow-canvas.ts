"use client"

import { useMemo } from "react"
import { useWorkflowBuilder } from "@/hooks/use-workflow-builder"

export function useWorkflowCanvas() {
  const { canvas, updateCanvas, selectedWorkflow, updateNodePosition } = useWorkflowBuilder()

  const bounds = useMemo(() => {
    const nodes = selectedWorkflow?.nodes ?? []
    if (nodes.length === 0) {
      return { minX: 0, maxX: 0, minY: 0, maxY: 0 }
    }

    return nodes.reduce(
      (acc, node) => ({
        minX: Math.min(acc.minX, node.x),
        maxX: Math.max(acc.maxX, node.x + node.width),
        minY: Math.min(acc.minY, node.y),
        maxY: Math.max(acc.maxY, node.y + node.height),
      }),
      { minX: Number.POSITIVE_INFINITY, maxX: Number.NEGATIVE_INFINITY, minY: Number.POSITIVE_INFINITY, maxY: Number.NEGATIVE_INFINITY }
    )
  }, [selectedWorkflow?.nodes])

  return {
    canvas,
    updateCanvas,
    updateNodePosition,
    bounds,
  }
}
