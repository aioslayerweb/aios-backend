"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Minus, Plus, Radar } from "lucide-react"
import { useWorkflowBuilder, useWorkflowCanvas } from "@/hooks"
import { WorkflowConnectionLayer } from "./workflow-connection-layer"
import { WorkflowNodeCard } from "@/components/workflow-nodes/workflow-node-card"

const MIN_ZOOM = 0.4
const MAX_ZOOM = 1.8

type DragState =
  | { kind: "pan"; startX: number; startY: number; originX: number; originY: number }
  | { kind: "node"; nodeId: string; startX: number; startY: number; originX: number; originY: number }

export function WorkflowCanvasSurface() {
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const [dragState, setDragState] = useState<DragState | null>(null)

  const {
    selectedWorkflow,
    selectedNodeId,
    selectedEdgeId,
    setSelectedNodeId,
    setSelectedEdgeId,
    updateNodePosition,
    execution,
  } = useWorkflowBuilder()
  const { canvas, updateCanvas } = useWorkflowCanvas()

  const nodes = selectedWorkflow?.nodes ?? []
  const edges = selectedWorkflow?.edges ?? []

  const worldStyle = useMemo(
    () => ({
      transform: `translate(${canvas.panX}px, ${canvas.panY}px) scale(${canvas.zoom})`,
      transformOrigin: "0 0",
      width: 5200,
      height: 3600,
      backgroundSize: `${canvas.gridSize}px ${canvas.gridSize}px`,
      backgroundImage:
        "linear-gradient(to right, rgba(148, 163, 184, 0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(148, 163, 184, 0.18) 1px, transparent 1px)",
    }),
    [canvas.gridSize, canvas.panX, canvas.panY, canvas.zoom]
  )

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      if (!dragState) {
        return
      }

      if (dragState.kind === "pan") {
        updateCanvas({
          panX: dragState.originX + (event.clientX - dragState.startX),
          panY: dragState.originY + (event.clientY - dragState.startY),
        })
        return
      }

      updateNodePosition(
        dragState.nodeId,
        dragState.originX + (event.clientX - dragState.startX) / canvas.zoom,
        dragState.originY + (event.clientY - dragState.startY) / canvas.zoom
      )
    }

    const onUp = () => {
      setDragState(null)
    }

    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)

    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
  }, [canvas.zoom, dragState, updateCanvas, updateNodePosition])

  return (
    <section className="relative rounded-xl border border-border bg-white shadow-sm" aria-label="Workflow canvas">
      <header className="flex items-center gap-2 border-b border-border px-3 py-2">
        <p className="text-sm font-semibold text-brand-navy">Canvas</p>
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => updateCanvas({ zoom: Math.max(MIN_ZOOM, Number((canvas.zoom - 0.1).toFixed(2))) })}
            className="rounded border border-border p-1 text-text-secondary"
            aria-label="Zoom out"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => updateCanvas({ zoom: 1, panX: 0, panY: 0 })}
            className="rounded border border-border px-2 py-1 text-[11px] text-text-secondary"
            aria-label="Reset canvas"
          >
            {Math.round(canvas.zoom * 100)}%
          </button>
          <button
            type="button"
            onClick={() => updateCanvas({ zoom: Math.min(MAX_ZOOM, Number((canvas.zoom + 0.1).toFixed(2))) })}
            className="rounded border border-border p-1 text-text-secondary"
            aria-label="Zoom in"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => updateCanvas({ snapToGrid: !canvas.snapToGrid })}
            className={canvas.snapToGrid ? "rounded border border-brand-primary bg-brand-subtle px-2 py-1 text-[11px] text-brand-navy" : "rounded border border-border px-2 py-1 text-[11px] text-text-secondary"}
            aria-pressed={canvas.snapToGrid}
          >
            <Radar className="mr-1 inline h-3 w-3" />Snap
          </button>
        </div>
      </header>

      <div
        ref={viewportRef}
        className="relative h-[68vh] overflow-auto"
        onWheel={(event) => {
          if (!event.ctrlKey && !event.metaKey) {
            return
          }

          event.preventDefault()
          const next = canvas.zoom - event.deltaY * 0.001
          updateCanvas({ zoom: Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number(next.toFixed(2)))) })
        }}
        onMouseDown={(event) => {
          if (event.target !== event.currentTarget) {
            return
          }

          setSelectedNodeId(null)
          setSelectedEdgeId(null)
          setDragState({ kind: "pan", startX: event.clientX, startY: event.clientY, originX: canvas.panX, originY: canvas.panY })
        }}
        aria-label="Zoomable workflow canvas"
      >
        <div className="relative" style={worldStyle}>
          <WorkflowConnectionLayer
            edges={edges}
            nodes={nodes}
            selectedEdgeId={selectedEdgeId}
            onSelectEdge={(id) => {
              setSelectedEdgeId(id)
              setSelectedNodeId(null)
            }}
          />

          {nodes.map((node) => (
            <WorkflowNodeCard
              key={node.id}
              node={node}
              active={selectedNodeId === node.id}
              selectedForExecution={execution.activeNodeId === node.id}
              onSelect={(id) => {
                setSelectedNodeId(id)
                setSelectedEdgeId(null)
              }}
              onMouseDown={(id, event) => {
                if ((event.target as HTMLElement).closest("button,input,textarea")) {
                  return
                }
                setDragState({
                  kind: "node",
                  nodeId: id,
                  startX: event.clientX,
                  startY: event.clientY,
                  originX: node.x,
                  originY: node.y,
                })
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
