import { Priority, Sentiment, Status } from "@/src/domain/common/enums"
import type { CalendarEvent, Conversation, Email, Meeting } from "@/src/domain/communication/types"
import { createId } from "@/src/domain/utils/id"

/** Creates a conversation aggregate. */
export function createConversation(partial: Partial<Conversation> = {}): Conversation {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("conversation"),
    workspaceId: partial.workspaceId ?? createId("workspace"),
    ownerId: partial.ownerId ?? createId("user"),
    subject: partial.subject ?? "Quarterly renewal alignment",
    participantIds: partial.participantIds ?? [],
    sentiment: partial.sentiment ?? Sentiment.Neutral,
    status: partial.status ?? Status.Active,
    searchText: partial.searchText ?? "quarterly renewal alignment",
    searchKeywords: partial.searchKeywords ?? ["renewal", "meeting"],
    tagIds: partial.tagIds ?? [],
    labelIds: partial.labelIds ?? [],
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

/** Creates an email entity. */
export function createEmail(partial: Partial<Email> = {}): Email {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("email"),
    workspaceId: partial.workspaceId ?? createId("workspace"),
    ownerId: partial.ownerId ?? createId("user"),
    conversationId: partial.conversationId,
    from: partial.from ?? { value: "owner@aios.example", verified: true },
    to: partial.to ?? [{ value: "recipient@customer.example", verified: false }],
    cc: partial.cc ?? [],
    bcc: partial.bcc ?? [],
    subject: partial.subject ?? "AIOS Opportunity Follow-up",
    body: partial.body ?? "Thank you for your time today. Sharing next steps and summary.",
    attachmentIds: partial.attachmentIds ?? [],
    priority: partial.priority ?? Priority.Medium,
    sentAt: partial.sentAt,
    searchText: partial.searchText ?? "opportunity follow-up",
    searchKeywords: partial.searchKeywords ?? ["email", "follow-up"],
    tagIds: partial.tagIds ?? [],
    labelIds: partial.labelIds ?? [],
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

/** Creates a meeting record. */
export function createMeeting(partial: Partial<Meeting> = {}): Meeting {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("meeting"),
    workspaceId: partial.workspaceId ?? createId("workspace"),
    ownerId: partial.ownerId ?? createId("user"),
    title: partial.title ?? "Executive Decision Review",
    attendeeIds: partial.attendeeIds ?? [],
    schedule:
      partial.schedule ?? {
        startAt: now,
        endAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      },
    location: partial.location ?? "Virtual",
    notes: partial.notes,
    tagIds: partial.tagIds ?? [],
    labelIds: partial.labelIds ?? [],
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}

/** Creates a calendar event entity. */
export function createCalendarEvent(partial: Partial<CalendarEvent> = {}): CalendarEvent {
  const now = new Date().toISOString()
  return {
    id: partial.id ?? createId("calendar_event"),
    workspaceId: partial.workspaceId ?? createId("workspace"),
    ownerId: partial.ownerId ?? createId("user"),
    title: partial.title ?? "Pipeline Health Check",
    schedule:
      partial.schedule ?? {
        startAt: now,
        endAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      },
    isAllDay: partial.isAllDay ?? false,
    source: partial.source ?? "manual",
    tagIds: partial.tagIds ?? [],
    labelIds: partial.labelIds ?? [],
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  }
}
