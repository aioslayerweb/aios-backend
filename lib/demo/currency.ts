const demoEuroFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 2,
});

const compactDemoEuroFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatDemoEuro(amount: number, compact = false): string {
  return (compact ? compactDemoEuroFormatter : demoEuroFormatter).format(amount);
}
