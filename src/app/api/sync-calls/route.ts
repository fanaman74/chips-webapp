import { NextResponse } from "next/server";
import { syncCallsFromEU } from "@/lib/calls";

// GET /api/sync-calls  — trigger a sync from the EU Funding & Tenders API
export async function GET() {
  const result = await syncCallsFromEU();
  return NextResponse.json(result, {
    status: result.error ? 500 : 200,
  });
}
