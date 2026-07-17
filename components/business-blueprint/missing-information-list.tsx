type MissingInformationListProps = {
  items: ReadonlyArray<string>
}

export function MissingInformationList({ items }: MissingInformationListProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Missing Information</p>
      {items.length ? (
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li key={item} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-700">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-emerald-700">No missing information detected for this selection.</p>
      )}
    </div>
  )
}
