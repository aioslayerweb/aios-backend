import type { Entity, OwnedEntity, SearchableEntity, TaggableEntity, Timestamped } from "@/src/domain/common/base"
import { Priority, Sentiment, Status } from "@/src/domain/common/enums"
import type { DateRange, EmailAddress } from "@/src/domain/common/value-objects"
import type {
  AttachmentId,
  CalendarEventId,
  ContactId,
  ConversationId,
  EmailId,
  MeetingId,
  UserId,
  WorkspaceId,
} from "@/src/domain/types/ids"

/** Conversation thread across channels for business communication context. */
export interface Conversation extends Entity<ConversationId>, Timestamped, OwnedEntity<UserId>, SearchableEntity, TaggableEntity {
  readonly workspaceId: WorkspaceId
  readonly subject: string
  readonly participantIds: ReadonlyArray<UserId | ContactId>
  readonly sentiment: Sentiment
  readonly status: Status
}

/** Email message with metadata and delivery state. */
export interface Email extends Entity<EmailId>, Timestamped, OwnedEntity<UserId>, SearchableEntity, TaggableEntity {
  readonly workspaceId: WorkspaceId
  readonly conversationId?: ConversationId
  readonly from: EmailAddress
  readonly to: ReadonlyArray<EmailAddress>
  readonly cc: ReadonlyArray<EmailAddress>
  readonly bcc: ReadonlyArray<EmailAddress>
  readonly subject: string
  readonly body: string
  readonly attachmentIds: ReadonlyArray<AttachmentId>
  readonly priority: Priority
  readonly sentAt?: string
}

/** Meeting entity for scheduled and completed collaboration sessions. */
export interface Meeting extends Entity<MeetingId>, Timestamped, OwnedEntity<UserId>, TaggableEntity {
  readonly workspaceId: WorkspaceId
  readonly title: string
  readonly attendeeIds: ReadonlyArray<UserId | ContactId>
  readonly schedule: DateRange
  readonly location?: string
  readonly notes?: string
}

/** Calendar event for user planning and automation triggers. */
export interface CalendarEvent extends Entity<CalendarEventId>, Timestamped, OwnedEntity<UserId>, TaggableEntity {
  readonly workspaceId: WorkspaceId
  readonly title: string
  readonly schedule: DateRange
  readonly isAllDay: boolean
  readonly source: "manual" | "email" | "calendar_sync" | "automation"
}
