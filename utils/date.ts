export function formatDateTime(value: string | number | Date): string {
  const date = new Date(value)
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

export function formatRelativeTime(value: string | number | Date): string {
  const date = new Date(value).getTime()
  const deltaSeconds = Math.round((date - Date.now()) / 1000)
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" })

  if (Math.abs(deltaSeconds) < 60) {
    return rtf.format(deltaSeconds, "second")
  }

  const deltaMinutes = Math.round(deltaSeconds / 60)
  if (Math.abs(deltaMinutes) < 60) {
    return rtf.format(deltaMinutes, "minute")
  }

  const deltaHours = Math.round(deltaMinutes / 60)
  if (Math.abs(deltaHours) < 24) {
    return rtf.format(deltaHours, "hour")
  }

  const deltaDays = Math.round(deltaHours / 24)
  return rtf.format(deltaDays, "day")
}
