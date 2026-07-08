import type { CalendarEvent, Conversation, Email, Meeting } from "@/src/domain/communication/types"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

/** Type guard for Conversation entities. */
export function isConversation(value: unknown): value is Conversation {
  return isRecord(value) && typeof value.id === "string" && typeof value.subject === "string"
}

/** Type guard for Email entities. */
export function isEmail(value: unknown): value is Email {
  return isRecord(value) && typeof value.id === "string" && isRecord(value.from)
}

/** Type guard for Meeting entities. */
export function isMeeting(value: unknown): value is Meeting {
  return isRecord(value) && typeof value.id === "string" && isRecord(value.schedule)
}

/** Type guard for CalendarEvent entities. */
export function isCalendarEvent(value: unknown): value is CalendarEvent {
  return isRecord(value) && typeof value.id === "string" && typeof value.isAllDay === "boolean"
}
