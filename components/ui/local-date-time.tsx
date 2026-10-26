"use client"

import { useEffect, useState } from "react"
import { formatStableDateTime, formatStableTime } from "@/utils/date"

export function LocalDateTime({ value }: { value: string | number }) {
  const date = new Date(value)
  const [formatted, setFormatted] = useState(() => formatStableDateTime(value))

  useEffect(() => {
    setFormatted(new Date(value).toLocaleString())
  }, [value])

  return (
    <time dateTime={Number.isNaN(date.getTime()) ? undefined : date.toISOString()}>
      {formatted}
    </time>
  )
}

export function LocalTime({ value }: { value: string | number }) {
  const date = new Date(value)
  const [formatted, setFormatted] = useState(() => formatStableTime(value))

  useEffect(() => {
    setFormatted(
      new Date(value).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    )
  }, [value])

  return (
    <time dateTime={Number.isNaN(date.getTime()) ? undefined : date.toISOString()}>
      {formatted}
    </time>
  )
}
