"use client";

import { memo } from "react";
import { cn } from "@/utils";

function Bone({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-slate-200/80",
        className,
      )}
      aria-hidden="true"
    />
  );
}

/** Mirrors the spatial header + KPI strip + domain widget grid */
export const NextGenSkeleton = memo(function NextGenSkeleton() {
  return (
    <div className="space-y-4 px-4 py-4 md:px-6 lg:px-8" aria-busy="true" aria-label="Loading workspace">
      {/* Header hero */}
      <div className="relative overflow-hidden rounded-[28px] border border-slate-200/70 bg-slate-50 p-4 md:p-5">
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white/80 p-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <Bone className="h-3 w-28" />
            <Bone className="h-7 w-56 md:w-72" />
            <Bone className="h-3 w-full max-w-xl" />
            <Bone className="h-3 w-2/3 max-w-lg" />
          </div>
          <Bone className="h-10 w-36 rounded-2xl" />
        </div>
        {/* KPI strip */}
        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-slate-100 bg-white/80 p-3 space-y-2">
              <Bone className="h-2.5 w-24" />
              <Bone className="h-7 w-20" />
              <Bone className="h-2.5 w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* Domain intelligence widgets */}
      <div className="space-y-2">
        <Bone className="h-3 w-40" />
        <Bone className="h-5 w-64" />
        <div className="grid gap-3 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-slate-100 bg-white p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <Bone className="h-2.5 w-32" />
                  <Bone className="h-7 w-24" />
                </div>
                <Bone className="h-9 w-9 rounded-xl" />
              </div>
              <Bone className="h-3 w-full" />
              <Bone className="h-3 w-3/4" />
              {/* sparkline placeholder */}
              <div className="flex h-8 items-end gap-0.5" aria-hidden="true">
                {Array.from({ length: 8 }).map((_, j) => (
                  <div
                    key={j}
                    className={cn("flex-1 animate-pulse rounded-sm bg-slate-200/80")}
                    style={{ height: `${30 + ((j * 11) % 70)}%` } as React.CSSProperties}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Operational controls */}
      <div className="space-y-2">
        <Bone className="h-3 w-36" />
        <Bone className="h-5 w-56" />
        <div className="grid gap-3 xl:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-slate-100 bg-white p-4 space-y-3">
              <Bone className="h-5 w-40" />
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="rounded-xl border border-slate-100 p-3 space-y-2">
                  <Bone className="h-3 w-full" />
                  <Bone className="h-3 w-2/3" />
                  <div className="flex justify-end gap-2">
                    <Bone className="h-8 w-20 rounded-lg" />
                    <Bone className="h-8 w-16 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
