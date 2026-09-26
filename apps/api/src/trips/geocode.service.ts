import { Injectable } from "@nestjs/common";

export interface LatLng {
  lat: number;
  lng: number;
}

const NOMINATIM = "https://nominatim.openstreetmap.org/search";

/**
 * Turn "Lekki Phase 1" into map coordinates (best effort).
 * Fails quietly — trips still work with plain labels.
 */
@Injectable()
export class GeocodeService {
  async geocode(label: string): Promise<LatLng | null> {
    try {
      const url = `${NOMINATIM}?q=${encodeURIComponent(label)}&countrycodes=ng&format=json&limit=1`;
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 6000);
      const res = await fetch(url, {
        signal: ctrl.signal,
        headers: { "User-Agent": "Nitu5-dev/0.1 (contact: dev@nitu5.com)" },
      });
      clearTimeout(timer);
      if (!res.ok) return null;
      const rows = (await res.json()) as Array<{ lat: string; lon: string }>;
      if (!rows.length) return null;
      return { lat: Number(rows[0].lat), lng: Number(rows[0].lon) };
    } catch {
      return null;
    }
  }
}
