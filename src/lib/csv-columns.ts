// src/lib/csv-columns.ts
// Auto-detección de columnas por palabras clave (multi-idioma).

import Papa from 'papaparse';

export type ColumnMapping = {
  date: string | null;
  description: string | null;
  amount: string | null;
};

const DATE_KEYWORDS = [
  'fecha', 'date', 'datum', 'data', 'fechavalor', 'fecha valor',
  'fechaoperacion', 'fecha operacion', 'booking', 'transaction date',
  'transaktiondatum', 'fechacontable', 'fecha contable',
];

const DESCRIPTION_KEYWORDS = [
  'concepto', 'concept', 'description', 'descripcion', 'descripción',
  'detalle', 'detail', 'memo', 'referencia', 'reference', 'beschreibung',
  'payee', 'beneficiary', 'beneficiario', 'nombre', 'name', 'detalle operacion',
];

const AMOUNT_KEYWORDS = [
  'importe', 'amount', 'cantidad', 'value', 'valor', 'betrag',
  'total', 'debit', 'credit', 'haber', 'debe', 'cantidad importe',
];

function normalize(s: string): string {
  return String(s)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\s+/g, '');
}

function headerMatchesKeywords(header: string, keywords: string[]): boolean {
  const n = normalize(header);
  return keywords.some((kw) => {
    const k = normalize(kw);
    if (n.includes(k)) return true;
    if (n.length >= 4 && k.includes(n)) return true;
    return false;
  });
}

/**
 * Detecta qué columnas del CSV corresponden a Fecha, Concepto e Importe
 * basándose en palabras clave en varios idiomas.
 */
export function detectColumnMapping(headers: string[]): ColumnMapping {
  const date = headers.find((h) => headerMatchesKeywords(h, DATE_KEYWORDS)) ?? null;
  const description = headers.find((h) => headerMatchesKeywords(h, DESCRIPTION_KEYWORDS)) ?? null;
  const amount = headers.find((h) => headerMatchesKeywords(h, AMOUNT_KEYWORDS)) ?? null;

  return { date, description, amount };
}

/**
 * Detecta el delimitador del CSV (coma o punto y coma) según una línea.
 */
export function detectDelimiterFromLine(line: string): ',' | ';' {
  const semicolons = (line.match(/;/g) ?? []).length;
  const commas = (line.match(/,/g) ?? []).length;
  return semicolons >= commas ? ';' : ',';
}

/**
 * Detecta el delimitador del CSV según la primera línea del texto.
 */
export function detectDelimiter(csvText: string): ',' | ';' {
  const first = csvText.trim().split(/\r?\n/)[0] ?? '';
  return detectDelimiterFromLine(first);
}

function splitLine(line: string, delimiter: ',' | ';'): string[] {
  return line.split(delimiter).map((c) => c.replace(/^"|"$/g, '').trim());
}

const MAX_HEADER_SCAN_LINES = 20;

/**
 * Busca la fila que contiene las cabeceras (Fecha, Concepto, Importe, etc.)
 * en las primeras líneas del CSV. Muchos bancos (p. ej. Santander) ponen
 * logo y título en las filas 1–7 y las cabeceras en la fila 8.
 * Devuelve esa fila como cabeceras y el índice para recortar el CSV.
 */
export function findHeaderRow(csvText: string): {
  headers: string[];
  lineIndex: number;
  delimiter: ',' | ';';
} {
  const cleaned = csvText.replace(/^\uFEFF/, '').trim();
  const lines = cleaned.split(/\r?\n/);
  if (lines.length === 0) return { headers: [], lineIndex: 0, delimiter: ',' };

  for (let i = 0; i < Math.min(MAX_HEADER_SCAN_LINES, lines.length); i++) {
    const line = lines[i];
    if (line.trim() === '') continue;
    const delimiter = detectDelimiterFromLine(line);
    const cells = splitLine(line, delimiter);
    const mapping = detectColumnMapping(cells);
    if (mapping.date && mapping.description && mapping.amount) {
      return { headers: cells, lineIndex: i, delimiter };
    }
  }

  const firstNonEmpty = lines.findIndex((l) => l.trim() !== '');
  const idx = firstNonEmpty >= 0 ? firstNonEmpty : 0;
  const delimiter = detectDelimiterFromLine(lines[idx] ?? '');
  const cells = splitLine(lines[idx] ?? '', delimiter);
  return { headers: cells, lineIndex: idx, delimiter };
}

/**
 * Devuelve las cabeceras del CSV. Si el archivo tiene filas previas (logo, título),
 * usa findHeaderRow para localizar la fila de cabeceras.
 */
export function getCsvHeaders(csvText: string): string[] {
  const { headers } = findHeaderRow(csvText);
  return headers;
}

/**
 * Recorta el CSV para que la primera línea sea la de cabeceras.
 * Devuelve el texto listo para Papa.parse(..., header: true).
 * Usa el mismo criterio que findHeaderRow (BOM + trim) para que el índice coincida.
 */
export function csvTextFromHeaderRow(csvText: string): { csvText: string; delimiter: ',' | ';' } {
  const cleaned = csvText.replace(/^\uFEFF/, '').trim();
  const lines = cleaned.split(/\r?\n/);
  const { lineIndex, delimiter } = findHeaderRow(csvText);
  const fromHeader = lines.slice(lineIndex).join('\n');
  return { csvText: fromHeader, delimiter };
}
