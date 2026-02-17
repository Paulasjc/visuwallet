// src/lib/parser.ts

// CORRECCIÓN 1: Importa el tipo 'PapaParseError' junto con 'Papa'.
import Papa, { type ParseError } from 'papaparse';
import { type Transaction } from '@/types';

interface ParseCsvOptions {
  csvText: string;
}

interface ParseCsvResult {
  transactions: Transaction[];
  errors: { message: string; row: number }[];
}

export const parseCsv = (options: ParseCsvOptions): ParseCsvResult => {
  const { csvText } = options;

  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  });

  const transactions: Transaction[] = [];
  const parsingErrors: ParseCsvResult['errors'] = [];

  for (const row of result.data as any[]) {
    const date = row.Fecha || row.Date || row.date;
    const description = row.Concepto || row.Description || row.description;
    const amount = row.Importe || row.Amount || row.amount;

    if (!date || !description || amount === undefined) {
      continue;
    }

    const transaction: Transaction = {
      date: new Date(date),
      description: String(description),
      amount: Number(amount),
      category: 'Sin categoría',
    };

    transactions.push(transaction);
  }

  // CORRECCIÓN 2: Añade el tipo 'PapaParseError' al parámetro 'e'.
  // Esto le dice a TypeScript que 'e' siempre tendrá las propiedades 'message' y 'row'.
  const allErrors = [
    ...parsingErrors,
    ...result.errors
      .filter((e: ParseError): e is ParseError & { row: number } => typeof e.row === 'number')
      .map((e: ParseError & { row: number }) => ({ message: e.message, row: e.row })),
  ];

  // Ahora, la línea del 'filter' que añadiste ya no es necesaria.
  return {
    transactions,
    errors: allErrors,
  };
};
