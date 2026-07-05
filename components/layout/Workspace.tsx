import type { ReactNode } from "react";

export default function Workspace({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen flex-1 bg-slate-950 p-4 text-slate-100 lg:p-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">{children}</div>
    </main>
  );
}
