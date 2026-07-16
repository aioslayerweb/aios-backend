export default function Loading() {
  return (
    <main className="public-safe-bottom">
      <section className="public-section pb-10 pt-20 lg:pt-24">
        <div className="public-container public-container-wide">
          <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="space-y-5">
              <div className="h-5 w-40 animate-pulse rounded-full bg-[var(--public-color-muted)]" />
              <div className="h-14 w-full max-w-3xl animate-pulse rounded-[18px] bg-[var(--public-color-muted)]" />
              <div className="h-20 w-full max-w-2xl animate-pulse rounded-[18px] bg-[var(--public-color-muted)]" />
              <div className="grid gap-4 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="public-card public-card-kpi">
                    <div className="h-4 w-24 animate-pulse rounded bg-[var(--public-color-muted)]" />
                    <div className="mt-4 h-7 w-20 animate-pulse rounded bg-[var(--public-color-muted)]" />
                  </div>
                ))}
              </div>
            </div>
            <div className="public-card public-card-floating h-[360px] animate-pulse bg-[var(--public-color-muted)]" />
          </div>
        </div>
      </section>
    </main>
  )
}
