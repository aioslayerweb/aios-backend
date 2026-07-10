"use client";

import { useMemo, useState } from "react";
import type { WorkspaceAction } from "@/components/workspace/types";

export function useCommandBar(initialQuery = "", actions: WorkspaceAction[] = []) {
  const [query, setQuery] = useState(initialQuery);

  return useMemo(
    () => ({
      query,
      setQuery,
      actions,
      reset: () => setQuery(initialQuery),
    }),
    [actions, initialQuery, query]
  );
}
