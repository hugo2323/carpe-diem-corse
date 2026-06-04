// Lecture du cache d'avis (data/reviews-cache.json), généré par le job V2.
// Le site lit toujours le dernier cache valide ; il n'affiche que les avis
// réellement vérifiés.

import rawCache from "@/data/reviews-cache.json";
import type { Review } from "./types";

type CacheBucket = { reviews?: unknown[]; fetched_at?: string | null };
type CacheShape = { airbnb?: CacheBucket; turo?: CacheBucket };

function isReview(v: unknown): v is Review {
  if (!v || typeof v !== "object") return false;
  const r = v as Record<string, unknown>;
  return (
    typeof r.id === "string" &&
    typeof r.rating === "number" &&
    typeof r.author_name === "string" &&
    typeof r.review_text === "string" &&
    typeof r.review_date === "string" &&
    typeof r.source_url === "string" &&
    typeof r.is_verified === "boolean"
  );
}

function readBucket(
  bucket: CacheBucket | undefined,
  source: Review["source"]
): { reviews: Review[]; fetchedAt: string | null } {
  const all = Array.isArray(bucket?.reviews) ? bucket!.reviews : [];
  // Garde-fou : on ne garde que les avis valides ET vérifiés.
  const reviews = all
    .filter(isReview)
    .filter((r) => r.is_verified && r.source === source);
  return { reviews, fetchedAt: bucket?.fetched_at ?? null };
}

export function getCachedAirbnbReviews() {
  return readBucket((rawCache as CacheShape).airbnb, "airbnb");
}

export function getCachedTuroReviews() {
  return readBucket((rawCache as CacheShape).turo, "turo");
}
