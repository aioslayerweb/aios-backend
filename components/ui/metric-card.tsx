import { Card, CardContent, CardHeader } from "./card"

type MetricCardProps = {
  label: string
  value: string
  delta?: string
}

export function MetricCard({ label, value, delta }: MetricCardProps) {
  return (
    <Card>
      <CardHeader>
        <p className="text-xs font-medium uppercase tracking-wide text-text-muted">{label}</p>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold text-brand-navy">{value}</p>
        {delta ? <p className="mt-1 text-sm text-text-secondary">{delta}</p> : null}
      </CardContent>
    </Card>
  )
}
