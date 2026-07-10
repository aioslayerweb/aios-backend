"use client";

import { useMemo } from "react";
import type { WorkspaceAction } from "@/components/workspace/types";

export function usePageActions(actions: WorkspaceAction[]) {
  return useMemo(() => actions, [actions]);
}
