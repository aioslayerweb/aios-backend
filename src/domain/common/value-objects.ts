/** Structured postal address used by organizations, companies, and contacts. */
export interface Address {
  readonly line1: string
  readonly line2?: string
  readonly city: string
  readonly state: string
  readonly postalCode: string
  readonly country: string
}

/** Phone value object with E.164-friendly representation. */
export interface Phone {
  readonly countryCode: string
  readonly nationalNumber: string
  readonly extension?: string
}

/** Email value object for validated email identity. */
export interface EmailAddress {
  readonly value: string
  readonly verified: boolean
}

/** Monetary value with explicit currency code for financial consistency. */
export interface Money {
  readonly amount: number
  readonly currency: string
}

/** Percentage value represented as 0-100 for executive metrics. */
export interface Percentage {
  readonly value: number
}

/** Date interval object used by planning and reporting entities. */
export interface DateRange {
  readonly startAt: string
  readonly endAt: string
}

/** Geographic location value object for map-aware business contexts. */
export interface GeoLocation {
  readonly latitude: number
  readonly longitude: number
  readonly accuracyMeters?: number
}

/** Business hours schedule in local timezone context. */
export interface BusinessHours {
  readonly timezone: string
  readonly weekdays: ReadonlyArray<{
    readonly day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"
    readonly open: string
    readonly close: string
  }>
}

/** BCP-47 style language value object. */
export interface Language {
  readonly code: string
  readonly label: string
}

/** Timezone value object compatible with IANA identifiers. */
export interface Timezone {
  readonly id: string
  readonly offsetMinutes: number
}
