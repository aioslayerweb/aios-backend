/** Default currency used by enterprise financial objects. */
export const DEFAULT_CURRENCY = "EUR"

/** Default language used by domain factories when locale is not specified. */
export const DEFAULT_LANGUAGE = "en-US"

/** Default timezone used by domain factories when timezone is not specified. */
export const DEFAULT_TIMEZONE = "UTC"

/** Domain-level limits used for safe defaults in lists and previews. */
export const DOMAIN_LIMITS = {
  maxTagsPerEntity: 20,
  maxCommentsPerEntity: 5000,
  maxSearchKeywords: 50,
} as const
