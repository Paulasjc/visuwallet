// src/lib/parse-helpers.ts
// Helpers para importes (EU/US) y fechas flexibles.

/**
 * Normaliza una cadena de importe (1.234,56 o 1,234.56) y devuelve el número.
 * Devuelve null si no se puede parsear.
 */
export function parseAmount(raw: unknown): number | null {
  if (raw === null || raw === undefined) return null;
  if (typeof raw === 'number' && !Number.isNaN(raw)) return raw;
  let s = String(raw).trim();
  if (s === '') return null;

  s = s.replace(/[\s€$£\u00A0]/g, '');
  const noSpaces = s;
  const lastComma = noSpaces.lastIndexOf(',');
  const lastDot = noSpaces.lastIndexOf('.');

  let normalized: string;
  if (lastComma >= 0 && lastDot >= 0) {
    if (lastComma > lastDot) {
      // Europeo: 1.234,56 → 1234.56
      normalized = noSpaces.replace(/\./g, '').replace(',', '.');
    } else {
      // US: 1,234.56 → 1234.56
      normalized = noSpaces.replace(/,/g, '');
    }
  } else if (lastComma >= 0) {
    const parts = noSpaces.split(',');
    const after = parts[parts.length - 1] ?? '';
    if (after.length === 3 && /^\d+$/.test(after)) {
      normalized = noSpaces.replace(/,/g, '');
    } else {
      normalized = noSpaces.replace(',', '.');
    }
  } else if (lastDot >= 0) {
    normalized = noSpaces;
  } else {
    normalized = noSpaces.replace(/,/g, '.');
  }

  const num = Number(normalized);
  return Number.isNaN(num) ? null : num;
}

/**
 * Parsea una fecha flexible: ISO, DD/MM/YYYY, DD-MM-YYYY, MM/DD/YYYY.
 * Devuelve null si no es válida.
 */
export function parseDate(raw: unknown): Date | null {
  if (raw === null || raw === undefined) return null;
  if (raw instanceof Date && !Number.isNaN(raw.getTime())) return raw;
  const s = String(raw).trim();
  if (s === '') return null;

  const iso = new Date(s);
  if (!Number.isNaN(iso.getTime())) return iso;

  const sep = s.includes('/') ? '/' : s.includes('-') ? '-' : null;
  if (!sep) return null;

  const parts = s.split(sep).map((p) => p.trim());
  if (parts.length !== 3) return null;

  const first = parseInt(parts[0], 10);
  const second = parseInt(parts[1], 10);
  const third = parseInt(parts[2], 10);
  if (Number.isNaN(first) || Number.isNaN(second) || Number.isNaN(third)) return null;

  let year: number;
  let month: number;
  let day: number;

  if (parts[0].length === 4) {
    year = first;
    month = second;
    day = third;
  } else {
    day = first;
    month = second;
    year = third;
    if (year < 100) year += year < 50 ? 2000 : 1900;
  }

  const d = new Date(year, month - 1, day);
  if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) return null;
  return d;
}
