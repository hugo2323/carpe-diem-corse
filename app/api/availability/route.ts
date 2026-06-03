import { NextResponse } from "next/server";
import { fetchMergedAvailability } from "@/lib/ical";

// Met en cache la réponse 1h côté serveur (les flux iCal ne sont pas temps réel).
export const revalidate = 3600;

export async function GET() {
  const data = await fetchMergedAvailability();
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
