// Récupération + fusion des calendriers de disponibilité (iCal) Airbnb / Abritel.
// Aucune dépendance externe : on parse uniquement les VEVENT (DTSTART/DTEND),
// ce qui suffit pour les flux d'export "indisponibilités" des plateformes.

export type IcalSource = {
  name: string;
  url: string | undefined;
};

export type SourceStatus = {
  name: string;
  configured: boolean; // une URL iCal est-elle renseignée ?
  ok: boolean; // le flux a-t-il été récupéré et parsé sans erreur ?
};

export type Availability = {
  blocked: string[]; // nuits indisponibles, format YYYY-MM-DD, triées
  sources: SourceStatus[];
};

// Les URLs iCal restent côté serveur (pas de NEXT_PUBLIC_) : renseignées dans
// les variables d'environnement de l'hébergeur (Vercel).
const ICAL_SOURCES: IcalSource[] = [
  { name: "Airbnb", url: process.env.AIRBNB_ICAL_URL },
  { name: "Abritel", url: process.env.ABRITEL_ICAL_URL },
];

// RFC 5545 : une ligne repliée continue sur la ligne suivante préfixée d'un
// espace ou d'une tabulation. On "déplie" avant de découper.
function unfold(ics: string): string[] {
  return ics
    .replace(/\r\n/g, "\n")
    .replace(/\n[ \t]/g, "")
    .split("\n");
}

// "20260615" ou "20260615T140000Z" -> "2026-06-15"
function parseIcalDate(value: string): string | null {
  const m = value.match(/(\d{4})(\d{2})(\d{2})/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : null;
}

type DateRange = { start: string; end: string }; // end exclusif (jour de départ)

export function parseBlockedRanges(ics: string): DateRange[] {
  const lines = unfold(ics);
  const ranges: DateRange[] = [];
  let cur: { start?: string | null; end?: string | null } | null = null;

  for (const line of lines) {
    if (line.startsWith("BEGIN:VEVENT")) {
      cur = {};
    } else if (line.startsWith("END:VEVENT")) {
      if (cur?.start) ranges.push({ start: cur.start, end: cur.end ?? cur.start });
      cur = null;
    } else if (cur) {
      const idx = line.indexOf(":");
      if (idx === -1) continue;
      const key = line.slice(0, idx); // peut contenir des paramètres (;VALUE=DATE)
      const val = line.slice(idx + 1);
      if (key.startsWith("DTSTART")) cur.start = parseIcalDate(val);
      else if (key.startsWith("DTEND")) cur.end = parseIcalDate(val);
    }
  }
  return ranges;
}

// Développe chaque plage [start, end[ en nuits individuelles bloquées.
export function expandBlockedDates(ranges: DateRange[]): Set<string> {
  const set = new Set<string>();
  for (const r of ranges) {
    const start = new Date(`${r.start}T00:00:00Z`);
    const end = new Date(`${r.end}T00:00:00Z`);
    if (Number.isNaN(start.getTime())) continue;

    if (r.start === r.end || Number.isNaN(end.getTime())) {
      set.add(r.start); // évènement d'un seul jour
      continue;
    }
    for (let d = start; d < end; d.setUTCDate(d.getUTCDate() + 1)) {
      set.add(d.toISOString().slice(0, 10));
    }
  }
  return set;
}

async function fetchSource(
  source: IcalSource
): Promise<{ status: SourceStatus; dates: Set<string> }> {
  if (!source.url) {
    return {
      status: { name: source.name, configured: false, ok: false },
      dates: new Set(),
    };
  }
  try {
    // Revalidation toutes les heures côté serveur (le flux iCal des plateformes
    // n'est de toute façon pas temps réel).
    const res = await fetch(source.url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return {
        status: { name: source.name, configured: true, ok: false },
        dates: new Set(),
      };
    }
    const text = await res.text();
    const dates = expandBlockedDates(parseBlockedRanges(text));
    return {
      status: { name: source.name, configured: true, ok: true },
      dates,
    };
  } catch {
    return {
      status: { name: source.name, configured: true, ok: false },
      dates: new Set(),
    };
  }
}

export async function fetchMergedAvailability(): Promise<Availability> {
  const results = await Promise.all(ICAL_SOURCES.map(fetchSource));

  const merged = new Set<string>();
  results.forEach((r) => r.dates.forEach((d) => merged.add(d)));

  return {
    blocked: Array.from(merged).sort(),
    sources: results.map((r) => r.status),
  };
}
