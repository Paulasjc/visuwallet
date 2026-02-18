// src/lib/parser.ts

import Papa, { type ParseError } from 'papaparse';
import { type Transaction } from '@/types';
import { categorizeTransaction } from './categorizer'; // Importamos la función

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

  const transactions: Transaction[] = []; // Inicializamos el array de transacciones aquí
  const parsingErrors: ParseCsvResult['errors'] = [];

  // --- BUCLE PRINCIPAL ---
  // Recorremos cada fila que nos da PapaParse
  for (const row of result.data as any[]) {
    // 1. Extraemos los datos de la fila actual
    const date = row.Fecha || row.Date || row.date;
    const description = row.Concepto || row.Description || row.description;
    const amount = row.Importe || row.Amount || row.amount;

    // 2. Validación: si faltan datos esenciales, saltamos a la siguiente fila
    if (!date || !description || amount === undefined) {
      continue;
    }

    // 3. Creamos un objeto de transacción con los datos limpios
    const transaction: Transaction = {
      date: new Date(date),
      description: String(description),
      amount: Number(amount),
      // Asignamos una categoría temporal que vamos a sobreescribir
      category: '', 
    };

    // 4. ¡MOMENTO CLAVE!
    //    Llamamos al categorizador para que nos dé la categoría correcta
    //    y la asignamos a nuestra transacción.
    transaction.category = categorizeTransaction(transaction);

    // 5. Añadimos la transacción completa (con su categoría) al array de resultados
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
