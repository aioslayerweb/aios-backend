export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value)
}

export function formatCurrency(value: number, currency = "EUR"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatPercent(value: number, maxFractionDigits = 1): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: maxFractionDigits,
  }).format(value)
}
