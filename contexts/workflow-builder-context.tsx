"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { useActivityFeedContext } from "@/contexts/activity-feed-context"
import { useMemoryContext } from "@/contexts/memory-context"
import { useNotificationContext } from "@/contexts/notification-context"
import { useRuntimeStatusContext } from "@/contexts/runtime-status-context"
import type {
  WorkflowAgentId,
  WorkflowBuilderState,
  WorkflowDefinition,
  WorkflowEdge,
  WorkflowHistoryEvent,
  WorkflowNode,
  WorkflowNodeType,
  WorkflowTemplate,
  WorkflowExecutionStep,
  WorkflowVersionStatus,
} from "@/types"
import {
  applyWorkflowFilters,
  buildExecutionSteps,
  defaultWorkflowBuilderState,
  snap,
} from "@/utils/workflow-builder"

type WorkflowBuilderContextValue = WorkflowBuilderState & {
  selectedWorkflow: WorkflowDefinition | null
  selectedNode: WorkflowNode | null
  filteredWorkflows: WorkflowDefinition[]
  setSelectedWorkflowId: (id: string) => void
  setSelectedNodeId: (id: string | null) => void
  setSelectedEdgeId: (id: string | null) => void
  updateFilters: (patch: Partial<WorkflowBuilderState["filters"]>) => void
  resetFilters: () => void
  updateCanvas: (patch: Partial<WorkflowBuilderState["canvas"]>) => void
  addNode: (type: WorkflowNodeType) => void
  updateNodePosition: (nodeId: string, x: number, y: number) => void
  updateNodeConfig: (nodeId: string, patch: Partial<WorkflowNode["data"]>) => void
  connectNodes: (sourceId: string, targetId: string, label?: string) => void
  duplicateTemplate: (templateId: string) => void
  runExecutionPreview: () => void
  stopExecutionPreview: () => void
  changeWorkflowStatus: (status: WorkflowVersionStatus) => void
  assignAgents: (nodeId: string, agents: WorkflowAgentId[]) => void
}

const WorkflowBuilderContext = createContext<WorkflowBuilderContextValue | null>(null)

function historyEvent(type: WorkflowHistoryEvent["type"], summary: string): WorkflowHistoryEvent {
  return {
    id: `wf-history-${Date.now()}-${Math.round(Math.random() * 9999)}`,
    type,
    timestamp: Date.now(),
    actor: "AIOS",
    summary,
  }
}

export function WorkflowBuilderProvider({ children }: { children: ReactNode }) {
  const defaults = useMemo(() => defaultWorkflowBuilderState(), [])

  const [workflows, setWorkflows] = useState(defaults.workflows)
  const [selectedWorkflowId, setSelectedWorkflowId] = useState(defaults.selectedWorkflowId)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(defaults.selectedNodeId)
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(defaults.selectedEdgeId)
  const [templates] = useState<WorkflowTemplate[]>(defaults.templates)
  const [canvas, setCanvas] = useState(defaults.canvas)
  const [execution, setExecution] = useState(defaults.execution)
  const [filters, setFilters] = useState(defaults.filters)

  const executionTimer = useRef<number | null>(null)

  const { addActivity } = useActivityFeedContext()
  const { addEntry } = useMemoryContext()
  const { notify } = useNotificationContext()
  const { updateModuleStatus } = useRuntimeStatusContext()

  const selectedWorkflow = useMemo(
    () => workflows.find((item) => item.id === selectedWorkflowId) ?? null,
    [selectedWorkflowId, workflows]
  )

  const selectedNode = useMemo(
    () => selectedWorkflow?.nodes.find((item) => item.id === selectedNodeId) ?? null,
    [selectedNodeId, selectedWorkflow]
  )

  const filteredWorkflows = useMemo(() => applyWorkflowFilters(workflows, filters), [filters, workflows])

  const updateWorkflow = useCallback(
    (updater: (workflow: WorkflowDefinition) => WorkflowDefinition) => {
      setWorkflows((previous) =>
        previous.map((workflow) => {
          if (workflow.id !== selectedWorkflowId) {
            return workflow
          }

          return updater(workflow)
        })
      )
    },
    [selectedWorkflowId]
  )

  const resetNodeSelection = useCallback(() => {
    setSelectedEdgeId(null)
  }, [])

  const updateCanvas = useCallback((patch: Partial<WorkflowBuilderState["canvas"]>) => {
    setCanvas((previous) => ({ ...previous, ...patch }))
  }, [])

  const addNode = useCallback(
    (type: WorkflowNodeType) => {
      if (!selectedWorkflow) {
        return
      }

      const id = `node-${Date.now()}-${Math.round(Math.random() * 9999)}`
      const x = snap(180 + selectedWorkflow.nodes.length * 40, canvas.gridSize)
      const y = snap(180 + selectedWorkflow.nodes.length * 28, canvas.gridSize)

      const newNode: WorkflowNode = {
        id,
        type,
        x,
        y,
        width: 220,
        height: 92,
        status: "idle",
        selected: false,
        data: {
          title: type.replace(/-/g, " ").replace(/\b\w/g, (value) => value.toUpperCase()),
          description: "Configure this node in the inspector panel.",
          inputs: ["context"],
          outputs: ["result"],
          configuration: { enabled: true },
          conditions: type === "decision" ? ["yes", "no"] : [],
          assignedAgents: ["operations-agent"],
          runtimeStatus: "Ready",
          loop:
            type === "loop"
              ? {
                  repeat: true,
                  retry: true,
                  timeoutSeconds: 240,
                  maxAttempts: 3,
                }
              : undefined,
          errorStrategy: "retry",
        },
      }

      updateWorkflow((workflow) => ({
        ...workflow,
        updatedAt: Date.now(),
        nodes: [...workflow.nodes, newNode],
        history: [historyEvent("edited", `Added ${newNode.data.title} node.`), ...workflow.history],
      }))

      setSelectedNodeId(id)
      resetNodeSelection()
    },
    [canvas.gridSize, resetNodeSelection, selectedWorkflow, updateWorkflow]
  )

  const updateNodePosition = useCallback(
    (nodeId: string, x: number, y: number) => {
      updateWorkflow((workflow) => ({
        ...workflow,
        updatedAt: Date.now(),
        nodes: workflow.nodes.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                x: canvas.snapToGrid ? snap(x, canvas.gridSize) : x,
                y: canvas.snapToGrid ? snap(y, canvas.gridSize) : y,
              }
            : node
        ),
      }))
    },
    [canvas.gridSize, canvas.snapToGrid, updateWorkflow]
  )

  const updateNodeConfig = useCallback(
    (nodeId: string, patch: Partial<WorkflowNode["data"]>) => {
      updateWorkflow((workflow) => ({
        ...workflow,
        updatedAt: Date.now(),
        nodes: workflow.nodes.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  ...patch,
                },
              }
            : node
        ),
      }))
    },
    [updateWorkflow]
  )

  const connectNodes = useCallback(
    (sourceId: string, targetId: string, label?: string) => {
      updateWorkflow((workflow) => {
        const exists = workflow.edges.some(
          (edge) => edge.source === sourceId && edge.target === targetId
        )
        if (exists) {
          return workflow
        }

        const edge: WorkflowEdge = {
          id: `edge-${sourceId}-${targetId}-${Date.now()}`,
          source: sourceId,
          target: targetId,
          label,
          animated: true,
          selected: false,
          condition: label === "YES" ? "yes" : label === "NO" ? "no" : "default",
        }

        return {
          ...workflow,
          updatedAt: Date.now(),
          edges: [...workflow.edges, edge],
          history: [historyEvent("edited", "Connected workflow nodes."), ...workflow.history],
        }
      })
    },
    [updateWorkflow]
  )

  const duplicateTemplate = useCallback(
    (templateId: string) => {
      const template = templates.find((item) => item.id === templateId)
      if (!template) {
        return
      }

      const now = Date.now()
      const workflow: WorkflowDefinition = {
        id: `wf-${template.id}-${now}`,
        name: `${template.name} Copy`,
        description: template.description,
        owner: "AIOS Workflow Team",
        department: template.department,
        tags: template.tags,
        status: "draft",
        createdAt: now,
        updatedAt: now,
        nodes: template.nodes.map((node) => ({ ...node, id: `${node.id}-${now}` })),
        edges: template.edges.map((edge) => ({
          ...edge,
          id: `${edge.id}-${now}`,
          source: `${edge.source}-${now}`,
          target: `${edge.target}-${now}`,
        })),
        history: [historyEvent("created", `Workflow duplicated from ${template.name}.`)],
        versions: [{ id: `ver-${now}`, version: 1, status: "draft", timestamp: now, note: "Template duplicate" }],
      }

      setWorkflows((previous) => [workflow, ...previous])
      setSelectedWorkflowId(workflow.id)
      setSelectedNodeId(workflow.nodes[0]?.id ?? null)
      setSelectedEdgeId(null)

      addActivity({
        id: `activity-workflow-duplicate-${now}`,
        title: "Workflow duplicated",
        summary: workflow.name,
        timestamp: now,
        category: "automations",
        source: { key: "automations", label: "Workflow Builder", workspace: "Workflows" },
        actor: { id: "workflow-builder", name: "Workflow Builder", kind: "system" },
        priority: "medium",
        pinned: false,
        unread: true,
        metadata: {
          eventType: "Automation Executed",
          workspace: "Workflows",
          status: "info",
          relatedObjects: [{ type: "workflow", id: workflow.id, label: workflow.name }],
          tags: ["workflow", "template", template.department],
        },
      })
    },
    [addActivity, templates]
  )

  const stopExecutionPreview = useCallback(() => {
    if (executionTimer.current) {
      window.clearInterval(executionTimer.current)
      executionTimer.current = null
    }

    setExecution((previous) => ({
      ...previous,
      running: false,
      activeNodeId: null,
      steps: previous.steps.map((step) => ({ ...step, status: "pending" })),
    }))

    updateModuleStatus("automation", {
      status: "active",
      label: "Idle",
      description: "Workflow Builder execution preview is idle.",
    })
  }, [updateModuleStatus])

  const runExecutionPreview = useCallback(() => {
    if (!selectedWorkflow || selectedWorkflow.nodes.length === 0) {
      return
    }

    if (executionTimer.current) {
      window.clearInterval(executionTimer.current)
    }

    const steps = buildExecutionSteps(selectedWorkflow.nodes)
    const estimatedDurationSeconds = steps.reduce((sum, step) => sum + step.estimatedSeconds, 0)

    setExecution({
      running: true,
      activeNodeId: steps[0]?.nodeId ?? null,
      steps,
      timeline: [{ id: `timeline-start-${Date.now()}`, label: "Execution preview started", timestamp: Date.now() }],
      estimatedDurationSeconds,
    })

    updateModuleStatus("automation", {
      status: "active",
      label: "Preview Running",
      description: "Workflow execution preview is active.",
    })

    let index = 0
    executionTimer.current = window.setInterval(() => {
      setExecution((previous) => {
        const nextSteps = previous.steps.map((step, stepIndex) => {
          let status: WorkflowExecutionStep["status"] = "pending"
          if (stepIndex < index) {
            status = "completed"
          } else if (stepIndex === index) {
            status = "running"
          }

          return { ...step, status }
        })

        const nextActive = nextSteps[index]?.nodeId ?? null
        const complete = index >= nextSteps.length

        return {
          ...previous,
          running: !complete,
          activeNodeId: nextActive,
          steps: nextSteps,
          timeline: [
            {
              id: `timeline-${Date.now()}`,
              label: complete
                ? "Execution preview completed"
                : `Running ${nextSteps[index]?.nodeTitle ?? "workflow step"}`,
              timestamp: Date.now(),
            },
            ...previous.timeline,
          ].slice(0, 24),
        }
      })

      updateWorkflow((workflow) => ({
        ...workflow,
        nodes: workflow.nodes.map((node, nodeIndex) => {
          if (nodeIndex < index) {
            return { ...node, status: "success" }
          }

          if (nodeIndex === index) {
            return { ...node, status: "running" }
          }

          return { ...node, status: "idle" }
        }),
      }))

      index += 1

      if (!selectedWorkflow || index > selectedWorkflow.nodes.length) {
        if (executionTimer.current) {
          window.clearInterval(executionTimer.current)
          executionTimer.current = null
        }

        addEntry({
          id: `memory-workflow-exec-${Date.now()}`,
          contextId: "workflow-builder",
          summary: `Execution preview completed for ${selectedWorkflow?.name ?? "workflow"}.`,
          createdAt: Date.now(),
        })

        addActivity({
          id: `activity-workflow-run-${Date.now()}`,
          title: "Workflow execution preview completed",
          summary: selectedWorkflow?.name ?? "Workflow",
          timestamp: Date.now(),
          category: "automations",
          source: { key: "automations", label: "Workflow Builder", workspace: "Workflows" },
          actor: { id: "workflow-runtime", name: "Workflow Runtime", kind: "system" },
          priority: "high",
          pinned: false,
          unread: true,
          metadata: {
            eventType: "Automation Executed",
            workspace: "Workflows",
            status: "completed",
            relatedObjects: [{ type: "workflow", id: selectedWorkflow?.id ?? "workflow", label: selectedWorkflow?.name ?? "Workflow" }],
            tags: ["workflow", "execution", selectedWorkflow?.department ?? "platform"],
          },
        })

        notify({
          title: "Workflow preview completed",
          description: `Execution preview finished for ${selectedWorkflow?.name ?? "workflow"}.`,
          category: "AI",
          priority: "MEDIUM",
          level: "SUCCESS",
          toast: true,
          autoDismissMs: 4200,
        })

        updateModuleStatus("automation", {
          status: "healthy",
          label: "Ready",
          description: "Workflow preview completed and ready for next run.",
        })

        updateWorkflow((workflow) => ({
          ...workflow,
          updatedAt: Date.now(),
          history: [historyEvent("executed", "Execution preview completed."), ...workflow.history],
        }))
      }
    }, 850)
  }, [addActivity, addEntry, notify, selectedWorkflow, updateModuleStatus, updateWorkflow])

  const changeWorkflowStatus = useCallback(
    (status: WorkflowVersionStatus) => {
      updateWorkflow((workflow) => {
        const nextVersion = workflow.versions[0]?.version ?? 0
        return {
          ...workflow,
          status,
          updatedAt: Date.now(),
          versions: [
            {
              id: `ver-${Date.now()}`,
              version: nextVersion + 1,
              status,
              timestamp: Date.now(),
              note: `Status changed to ${status}.`,
            },
            ...workflow.versions,
          ].slice(0, 16),
          history: [
            historyEvent(status === "published" ? "published" : status === "archived" ? "archived" : "edited", `Workflow marked as ${status}.`),
            ...workflow.history,
          ],
        }
      })
    },
    [updateWorkflow]
  )

  const assignAgents = useCallback(
    (nodeId: string, agents: WorkflowAgentId[]) => {
      updateNodeConfig(nodeId, { assignedAgents: agents })
    },
    [updateNodeConfig]
  )

  useEffect(() => {
    if (!selectedWorkflow) {
      return
    }

    setExecution((previous) => ({
      ...previous,
      steps: buildExecutionSteps(selectedWorkflow.nodes),
      estimatedDurationSeconds: selectedWorkflow.nodes.length * 40,
    }))
  }, [selectedWorkflow])

  useEffect(() => {
    return () => {
      if (executionTimer.current) {
        window.clearInterval(executionTimer.current)
      }
    }
  }, [])

  const value = useMemo<WorkflowBuilderContextValue>(
    () => ({
      workflows,
      selectedWorkflowId,
      selectedNodeId,
      selectedEdgeId,
      templates,
      canvas,
      execution,
      filters,
      selectedWorkflow,
      selectedNode,
      filteredWorkflows,
      setSelectedWorkflowId,
      setSelectedNodeId,
      setSelectedEdgeId,
      updateFilters: (patch) => setFilters((previous) => ({ ...previous, ...patch })),
      resetFilters: () => setFilters(defaults.filters),
      updateCanvas,
      addNode,
      updateNodePosition,
      updateNodeConfig,
      connectNodes,
      duplicateTemplate,
      runExecutionPreview,
      stopExecutionPreview,
      changeWorkflowStatus,
      assignAgents,
    }),
    [
      addNode,
      assignAgents,
      canvas,
      changeWorkflowStatus,
      connectNodes,
      defaults.filters,
      duplicateTemplate,
      execution,
      filteredWorkflows,
      filters,
      runExecutionPreview,
      selectedEdgeId,
      selectedNode,
      selectedNodeId,
      selectedWorkflow,
      selectedWorkflowId,
      stopExecutionPreview,
      templates,
      updateCanvas,
      updateNodeConfig,
      updateNodePosition,
      workflows,
    ]
  )

  return <WorkflowBuilderContext.Provider value={value}>{children}</WorkflowBuilderContext.Provider>
}

export function useWorkflowBuilderContext(): WorkflowBuilderContextValue {
  const context = useContext(WorkflowBuilderContext)
  if (!context) {
    throw new Error("useWorkflowBuilderContext must be used within WorkflowBuilderProvider")
  }

  return context
}
