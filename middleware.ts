import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(_request: NextRequest) {
  // Demo mode: authentication is intentionally disabled for all /app routes.
  // Future auth checks can be added here without modifying /app page implementations.
  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*"],
};