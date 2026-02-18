// src/lib/parser.ts

import Papa, { type ParseError } from 'papaparse';
import { type Transaction } from '@/types';
import { categorizeTransaction } from './categorizer';
import { detectColumnMapping, csvTextFromHeaderRow, type ColumnMapping } from './csv-columns';
import { parseAmount, parseDate } from './parse-helpers';

export type { ColumnMapping };

export interface ParseCsvOptions {
  csvText: string;
  /** Si no se pasa, se auto-detecta a partir de las cabeceras. */
  columnMapping?: ColumnMapping | null;
}

export interface ParseCsvResult {
  transactions: Transaction[];
  errors: { message: string; row: number }[];
}

const stripBom = (s: string): string => s.replace(/^\uFEFF/, '');

export const parseCsv = (options: ParseCsvOptions): ParseCsvResult => {
  const { csvText: rawCsv, columnMapping: optionMapping } = options;
  const csvText = stripBom(rawCsv);

  const { csvText: fromHeader, delimiter } = csvTextFromHeaderRow(csvText);
  const result = Papa.parse(fromHeader, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
    delimiter,
  });

  const actualFields: string[] =
    result.meta.fields ?? (result.data[0] ? Object.keys(result.data[0] as object) : []);

  const mapping: ColumnMapping = optionMapping ?? detectColumnMapping(actualFields);

  const resolveKey = (key: string | null): string | null => {
    if (key == null) return null;
    const found = actualFields.find((f) => f.trim() === key.trim());
    return found ?? key;
  };

  const keyDate = resolveKey(mapping.date);
  const keyDesc = resolveKey(mapping.description);
  const keyAmount = resolveKey(mapping.amount);

  if (!keyDate || !keyDesc || !keyAmount) {
    return {
      transactions: [],
      errors: result.errors
        .filter((e: ParseError): e is ParseError & { row: number } => typeof e.row === 'number')
        .map((e: ParseError & { row: number }) => ({ message: e.message, row: e.row })),
    };
  }

  const transactions: Transaction[] = [];
  const parsingErrors: ParseCsvResult['errors'] = [];

  for (const row of result.data as Record<string, unknown>[]) {
    const rawDate = row[keyDate];
    const rawDescription = row[keyDesc];
    const rawAmount = row[keyAmount];

    const date = parseDate(rawDate);
    const description = rawDescription != null && String(rawDescription).trim() !== '' ? String(rawDescription).trim() : null;
    const amount = parseAmount(rawAmount);

    if (date == null || description == null || amount == null) continue;

    const transaction: Transaction = {
      date,
      description,
      amount,
      category: '',
    };
    transaction.category = categorizeTransaction(transaction);
    transactions.push(transaction);
  }

  const allErrors = [
    ...parsingErrors,
    ...result.errors
      .filter((e: ParseError): e is ParseError & { row: number } => typeof e.row === 'number')
      .map((e: ParseError & { row: number }) => ({ message: e.message, row: e.row })),
  ];

  return {
    transactions,
    errors: allErrors,
  };
};
