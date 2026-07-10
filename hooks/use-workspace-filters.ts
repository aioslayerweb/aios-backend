"use client";

import { useMemo, useState } from "react";

export type WorkspaceFilters<T extends string> = {
  query: string;
  categories: T[];
  statuses: T[];
};

export function useWorkspaceFilters<T extends string>(initialCategories: T[] = [], initialStatuses: T[] = []) {
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<T[]>(initialCategories);
  const [statuses, setStatuses] = useState<T[]>(initialStatuses);

  return useMemo(
    () => ({
      query,
      setQuery,
      categories,
      setCategories,
      statuses,
      setStatuses,
      clear: () => {
        setQuery("");
        setCategories(initialCategories);
        setStatuses(initialStatuses);
      },
    }),
    [categories, initialCategories, initialStatuses, query, statuses]
  );
}
