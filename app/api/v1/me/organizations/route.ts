import { createSupabaseBffHandlers } from "@/lib/auth/supabase-bff"

export const runtime = "nodejs"
export const GET = createSupabaseBffHandlers().organizations
