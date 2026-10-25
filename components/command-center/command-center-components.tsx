"use client";

import Link from "next/link";
import { memo, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AudioLines,
  AtSign,
  ChevronRight,
  Command,
  FileUp,
  Layers,
  Mic,
  Plus,
  SendHorizonal,
  Sparkles,
} from "lucide-react";
import { useNavigationBase } from "@/contexts/navigation-context";
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Badge,
} from "@/components/ui";
import { cn } from "@/utils";
import type {
  AgentItem,
  CardMetric,
  CommandChip,
  CommandSuggestion,
  ConnectedSystem,
  DecisionItem,
  MeetingItem,
  NotificationItem,
  PriorityItem,
  WorkflowItem,
  WorkspaceLink,
} from "./types";

const staggerList = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemMotion = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.28,
      ease: [0.22, 0.61, 0.36, 1] as [number, number, number, number],
    },
  },
};

function chipToneClass(tone: CommandChip["tone"]): string {
  if (tone === "info") return "border-[var(--color-semantic-info)] bg-[var(--color-semantic-info-soft)] text-[var(--color-semantic-info-text)]";
  if (tone === "success") return "border-[var(--color-semantic-success)] bg-[var(--color-semantic-success-soft)] text-[var(--color-semantic-success-text)]";
  if (tone === "warning") return "border-[var(--color-semantic-warning)] bg-[var(--color-semantic-warning-soft)] text-[var(--color-semantic-warning-text)]";
  return "border-border bg-surface-muted text-text-secondary";
}

function metricToneClass(tone: CardMetric["tone"]): string {
  if (tone === "good") return "text-emerald-600";
  if (tone === "warn") return "text-amber-600";
  if (tone === "critical") return "text-rose-600";
  return "text-text-muted";
}

function severityToneClass(level: NotificationItem["severity"]): string {
  if (level === "critical") return "bg-semantic-error";
  if (level === "warning") return "bg-semantic-warning";
  return "bg-semantic-info";
}

function statusToneClass(status: DecisionItem["status"]): string {
  if (status === "approved") return "bg-[var(--color-semantic-success-soft)] text-[var(--color-semantic-success-text)] ring-emerald-200";
  if (status === "blocked") return "bg-[var(--color-semantic-error-soft)] text-[var(--color-semantic-error-text)] ring-rose-200";
  return "bg-[var(--color-semantic-warning-soft)] text-[var(--color-semantic-warning-text)] ring-amber-200";
}

function agentToneClass(status: AgentItem["status"]): string {
  if (status === "active") return "bg-semantic-success";
  if (status === "attention") return "bg-semantic-error";
  return "bg-slate-400";
}

export function SidebarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="overflow-hidden border-border/90 bg-white">
      <CardHeader className="flex items-center justify-between py-3">
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">{title}</h3>
      </CardHeader>
      <CardContent className="space-y-2 p-3">{children}</CardContent>
    </Card>
  );
}

export function QuickActionButton({
  label,
  onClick,
  disabled = false,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center rounded-md border border-border bg-surface-canvas px-3 py-2 text-xs font-semibold text-text-secondary transition hover:-translate-y-0.5 hover:border-brand-primary/30 hover:text-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
    >
      {label}
    </button>
  );
}

export const CommandComposer = memo(function CommandComposer({
  chips,
  suggestions,
  quickActions,
  agents,
}: {
  chips: CommandChip[];
  suggestions: CommandSuggestion[];
  quickActions: WorkspaceLink[];
  agents: AgentItem[];
}) {
  const [value, setValue] = useState("Show today's executive priorities");
  const [selectedAgentIndex, setSelectedAgentIndex] = useState(0);
  const [contextItems, setContextItems] = useState<string[]>([]);
  const [previewMessage, setPreviewMessage] = useState("");
  const { baseHref } = useNavigationBase();

  const topSuggestions = useMemo(() => suggestions.slice(0, 7), [suggestions]);
  const selectedAgent = agents[selectedAgentIndex];
  const routeHref = (href: string) => href.replace(/^\/app(?=\/|$)/, baseHref);

  const addContext = (context: string) => {
    setContextItems((current) => current.includes(context) ? current : [...current, context]);
    setPreviewMessage(`${context} added to the local command context.`);
  };

  const previewCommand = () => {
    const command = value.trim();
    if (!command) {
      setPreviewMessage("Enter a command before requesting a preview.");
      return;
    }
    setPreviewMessage(`Preview only: "${command}" is ready for review. No command was executed and no business data was changed.`);
  };

  return (
    <Card className="overflow-hidden border-border bg-white shadow-sm">
      <CardHeader className="py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">Command Composer</p>
            <h2 className="mt-1 text-lg font-semibold text-brand-navy">Operational Intelligence Console</h2>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone="info">/ slash commands</Badge>
            <Badge tone="success">voice</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-4 md:p-5">
        <label className="block rounded-xl border border-border bg-surface-canvas px-4 py-3 focus-within:border-brand-primary/50">
          <span className="sr-only">Command input</span>
          <textarea
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setPreviewMessage("");
            }}
            rows={4}
            placeholder="Compose enterprise command..."
            className="w-full resize-none bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
            aria-label="Command composer input"
          />
        </label>

        <div className="flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <span key={chip.id} className={cn("rounded-full border px-2.5 py-1 text-[11px] font-semibold", chipToneClass(chip.tone))}>
              {chip.label}
            </span>
          ))}
          {contextItems.map((context) => (
            <button
              key={context}
              type="button"
              onClick={() => setContextItems((current) => current.filter((item) => item !== context))}
              className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-800"
              aria-label={`Remove ${context} context`}
            >
              {context} ×
            </button>
          ))}
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <QuickActionButton
            label={selectedAgent ? `Agent: ${selectedAgent.name}` : "Agent unavailable"}
            disabled={!selectedAgent}
            onClick={() => {
              if (agents.length > 0) {
                const nextIndex = (selectedAgentIndex + 1) % agents.length;
                setSelectedAgentIndex(nextIndex);
                setPreviewMessage(`Sample agent context changed to ${agents[nextIndex]?.name}.`);
              }
            }}
          />
          <QuickActionButton
            label="Organization Selector"
            onClick={() => addContext("Sample organization")}
          />
          <QuickActionButton
            label="Attach Context"
            onClick={() => addContext("Executive priorities")}
          />
          <QuickActionButton
            label="Insert Template"
            onClick={() => {
              setValue("Review the following business signal. Summarize evidence, explain its impact, and recommend a human-reviewed next step.");
              setPreviewMessage("A review template was inserted into the composer.");
            }}
          />
        </div>

        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.id}
              href={routeHref(action.href)}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-xs font-medium text-text-secondary transition hover:border-brand-primary/30 hover:text-brand-navy"
            >
              <Sparkles size={14} />
              {action.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="primary" size="sm" className="rounded-lg" onClick={previewCommand}>
            <SendHorizonal size={14} />
            Preview Command
          </Button>
          <Button variant="secondary" size="sm" className="rounded-lg" onClick={() => setValue((current) => current.startsWith("/") ? current : `/ ${current}`)}>
            <Command size={14} />
            Slash
          </Button>
          <Button variant="secondary" size="sm" className="rounded-lg" disabled title="Voice input is unavailable in this preview.">
            <Mic size={14} />
            Voice
          </Button>
          <Button variant="secondary" size="sm" className="rounded-lg" disabled title="File attachments are unavailable in this preview.">
            <FileUp size={14} />
            Attachment
          </Button>
          <Button variant="secondary" size="sm" className="rounded-lg" onClick={() => addContext("Executive priorities")}>
            <AtSign size={14} />
            Context Chips
          </Button>
          <Button variant="secondary" size="sm" className="rounded-lg" disabled title="Live briefing requires a connected briefing service.">
            <AudioLines size={14} />
            Live Brief
          </Button>
        </div>

        <p className="text-xs text-text-muted">Sample context only. Voice, file upload, and live briefing require integrations unavailable in this preview.</p>
        {previewMessage ? <p role="status" aria-live="polite" className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-900">{previewMessage}</p> : null}

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">Suggested Commands</p>
          <motion.div variants={staggerList} initial="hidden" animate="show" className="grid gap-2 sm:grid-cols-2">
            {topSuggestions.map((suggestion) => (
              <motion.button
                key={suggestion.id}
                variants={itemMotion}
                type="button"
                onClick={() => setValue(suggestion.label)}
                className="rounded-lg border border-border bg-surface-canvas px-3 py-2 text-left text-sm text-text-secondary transition hover:border-brand-primary/30 hover:text-brand-navy"
              >
                {suggestion.label}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
});

export function IntelligenceCard({
  title,
  children,
  action,
  actionHref,
}: {
  title: string;
  children: React.ReactNode;
  action?: string;
  actionHref?: string;
}) {
  const { baseHref } = useNavigationBase();
  const href = actionHref?.replace(/^\/app(?=\/|$)/, baseHref);
  return (
    <Card className="overflow-hidden border-border bg-white">
      <CardHeader className="flex items-center justify-between py-3">
        <h3 className="text-sm font-semibold text-brand-navy">{title}</h3>
        {action && href ? <Link href={href} className="text-xs font-medium text-brand-primary hover:underline">{action}</Link> : null}
      </CardHeader>
      <CardContent className="space-y-3 p-4">{children}</CardContent>
    </Card>
  );
}

export function SuggestionCard({
  title,
  meta,
}: {
  title: string;
  meta: string;
}) {
  return (
    <article className="rounded-xl border border-border bg-surface-canvas px-3 py-2">
      <p className="text-sm font-medium text-brand-navy">{title}</p>
      <p className="mt-1 text-xs text-text-muted">{meta}</p>
    </article>
  );
}

export function PriorityCard({ item }: { item: PriorityItem }) {
  return (
    <article className="rounded-xl border border-border bg-surface-canvas p-3">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-brand-navy">{item.title}</h4>
        <span className="rounded-full bg-[var(--color-semantic-info-soft)] px-2 py-0.5 text-[11px] font-semibold text-[var(--color-semantic-info-text)]">{item.score}</span>
      </div>
      <p className="mt-2 text-xs text-text-secondary">Owner: {item.owner}</p>
      <p className="mt-1 text-xs text-text-muted">Due: {item.due}</p>
    </article>
  );
}

export function DecisionCard({ item }: { item: DecisionItem }) {
  return (
    <article className="rounded-xl border border-border bg-surface-canvas p-3">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-brand-navy">{item.title}</h4>
        <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1", statusToneClass(item.status))}>
          {item.status}
        </span>
      </div>
      <p className="mt-2 text-xs text-text-secondary">Impact: {item.impact}</p>
      <p className="mt-1 text-xs text-text-muted">Confidence: {item.confidence}%</p>
    </article>
  );
}

export function WorkflowCard({ item }: { item: WorkflowItem }) {
  return (
    <article className="rounded-xl border border-border bg-surface-canvas p-3">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-semibold text-brand-navy">{item.name}</h4>
        <span className="text-xs text-text-muted">{item.progress}%</span>
      </div>
      <p className="mt-2 text-xs text-text-secondary">Stage: {item.stage}</p>
      <p className="mt-1 text-xs text-text-muted">Owner: {item.owner}</p>
      <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100">
        <div className="h-1.5 rounded-full bg-brand-primary" style={{ width: `${item.progress}%` }} />
      </div>
    </article>
  );
}

export function AgentStatusCard({ item }: { item: AgentItem }) {
  return (
    <article className="rounded-xl border border-border bg-surface-canvas p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={cn("h-2.5 w-2.5 rounded-full", agentToneClass(item.status))} />
          <p className="text-sm font-semibold text-brand-navy">{item.name}</p>
        </div>
        <p className="text-xs text-text-muted">{item.tasks} tasks</p>
      </div>
      <p className="mt-1 text-xs text-text-secondary">{item.role}</p>
    </article>
  );
}

export function OrganizationSnapshot({ metrics }: { metrics: CardMetric[] }) {
  return (
    <IntelligenceCard title="Organization Snapshot" action="View details">
      <div className="grid gap-2 sm:grid-cols-2">
        {metrics.slice(0, 4).map((metric) => (
          <article key={metric.id} className="rounded-lg border border-border bg-surface-canvas p-2.5">
            <p className="text-[11px] uppercase tracking-wide text-text-muted">{metric.label}</p>
            <p className="mt-1 text-base font-semibold text-brand-navy">{metric.value}</p>
            <p className={cn("text-[11px]", metricToneClass(metric.tone))}>{metric.trend}</p>
          </article>
        ))}
      </div>
    </IntelligenceCard>
  );
}

export function RuntimeHealthCard({ metrics }: { metrics: CardMetric[] }) {
  return (
    <IntelligenceCard title="Runtime Health" action="Status">
      <div className="space-y-2">
        {metrics.slice(4).map((metric) => (
          <div key={metric.id} className="flex items-center justify-between rounded-lg border border-border bg-surface-canvas px-3 py-2">
            <p className="text-xs text-text-secondary">{metric.label}</p>
            <p className="text-sm font-semibold text-brand-navy">{metric.value}</p>
          </div>
        ))}
      </div>
    </IntelligenceCard>
  );
}

export function NotificationCard({ item }: { item: NotificationItem }) {
  return (
    <article className="rounded-xl border border-border bg-surface-canvas p-3">
      <div className="flex items-start gap-2">
        <span className={cn("mt-1 h-2 w-2 rounded-full", severityToneClass(item.severity))} />
        <div>
          <p className="text-sm font-semibold text-brand-navy">{item.title}</p>
          <p className="mt-1 text-xs text-text-secondary">{item.detail}</p>
          <p className="mt-1 text-[11px] text-text-muted">{item.time}</p>
        </div>
      </div>
    </article>
  );
}

export function UpcomingMeetingCard({ item }: { item: MeetingItem }) {
  return (
    <article className="rounded-xl border border-border bg-surface-canvas p-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-brand-navy">{item.title}</p>
        <p className="text-xs text-text-muted">{item.time}</p>
      </div>
      <p className="mt-1 text-xs text-text-secondary">{item.audience}</p>
    </article>
  );
}

export function ConnectedSystemCard({ item }: { item: ConnectedSystem }) {
  const Icon = item.icon;

  return (
    <article className="flex items-center justify-between rounded-xl border border-border bg-surface-canvas px-3 py-2.5">
      <div className="flex items-center gap-2">
        <span className="rounded-md bg-slate-100 p-1.5 text-text-secondary">
          <Icon size={14} />
        </span>
        <p className="text-sm font-medium text-brand-navy">{item.name}</p>
      </div>
      <span className={cn("h-2.5 w-2.5 rounded-full", item.state === "connected" ? "bg-semantic-success" : "bg-semantic-warning")} />
    </article>
  );
}

export function LinkList({ items }: { items: WorkspaceLink[] }) {
  const { baseHref } = useNavigationBase();
  return (
    <motion.ul variants={staggerList} initial="hidden" animate="show" className="space-y-2">
      {items.map((item) => (
        <motion.li key={item.id} variants={itemMotion}>
          <Link
            href={item.href.replace(/^\/app(?=\/|$)/, baseHref)}
            className="group flex items-center justify-between rounded-lg border border-border bg-surface-canvas px-3 py-2 text-sm transition hover:border-brand-primary/30"
          >
            <span className="font-medium text-brand-navy">{item.label}</span>
            <span className="ml-3 inline-flex items-center gap-1 text-xs text-text-muted">
              {item.meta}
              <ChevronRight size={12} className="opacity-0 transition group-hover:opacity-100" />
            </span>
          </Link>
        </motion.li>
      ))}
    </motion.ul>
  );
}

export function LeftRailLinks({ title, items }: { title: string; items: WorkspaceLink[] }) {
  const { baseHref } = useNavigationBase();
  return (
    <SidebarSection title={title}>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href.replace(/^\/app(?=\/|$)/, baseHref)}
              className="group flex items-center justify-between rounded-lg border border-border bg-surface-canvas px-3 py-2 text-sm hover:border-brand-primary/30"
            >
              <span className="font-medium text-brand-navy">{item.label}</span>
              <span className="inline-flex items-center gap-1 text-[11px] text-text-muted">
                {item.meta}
                <Plus size={12} className="opacity-0 transition group-hover:opacity-100" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </SidebarSection>
  );
}

export function SectionKicker({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-text-muted">{title}</h2>
        <p className="mt-1 text-lg font-semibold text-brand-navy">{subtitle}</p>
      </div>
      <span className="inline-flex items-center gap-1 rounded-full bg-brand-subtle px-3 py-1 text-xs font-semibold text-brand-navy">
        <Layers size={13} />
        AIOS
      </span>
    </div>
  );
}
