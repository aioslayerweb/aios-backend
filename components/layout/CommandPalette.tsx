"use client";

import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { useAIOSRuntime } from "./AIOSRuntimeContext";

export default function CommandPalette() {
  const { runIntent, isRunning } = useAIOSRuntime();
  const [value, setValue] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await runIntent(value);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-cyan-300">
        <Sparkles size={16} />
        Command Palette
      </div>
      <label className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 px-3 py-3">
        <Search size={16} className="text-slate-400" />
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Try: Show top 10 churn risk customers"
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
        />
      </label>
      <button
        type="submit"
        disabled={isRunning || !value.trim()}
        className="mt-3 rounded-lg bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isRunning ? "Running workflow..." : "Run workflow"}
      </button>
    </form>
  );
}
