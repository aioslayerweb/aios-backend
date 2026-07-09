/** Relationship direction between domain aggregates. */
export type RelationshipDirection = "one-way" | "two-way"

/** Generic entity reference used across the domain model. */
export interface EntityRelationship<FromId extends string = string, ToId extends string = string> {
  readonly fromId: FromId
  readonly toId: ToId
  readonly relationship: string
  readonly direction: RelationshipDirection
  readonly weight?: number
}

/** Lightweight entity reference for cross-module navigation. */
export interface EntityRef<Id extends string = string> {
  readonly id: Id
  readonly type: string
  readonly label: string
}