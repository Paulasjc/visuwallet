import { type Transaction } from '@/types';

// Definimos un conjunto de reglas de categorización.
// La clave es la categoría, y el valor es un array de palabras clave a buscar.
const CATEGORY_RULES: Record<string, string[]> = {
  'Compras': ['amazon', 'aliexpress', 'el corte ingles', 'zara'],
  'Alimentación': ['mercadona', 'lidl', 'carrefour', 'supermercado'],
  'Transporte': ['uber', 'cabify', 'metro', 'renfe'],
  'Ocio': ['netflix', 'spotify', 'hbo', 'cine', 'restaurante'],
  'Nómina': ['nomina', 'nómina', 'transferencia de', 'ingreso'],
};

// Esta será nuestra categoría por defecto si no encontramos ninguna coincidencia.
const DEFAULT_CATEGORY = 'Otros Gastos';

export const categorizeTransaction = (transaction: Transaction): string => {
  const description = transaction.description.toLowerCase(); // Convertimos a minúsculas para comparar sin errores.

  // Recorremos nuestras reglas.
  for (const category in CATEGORY_RULES) {
    // Para cada categoría, comprobamos si alguna de sus palabras clave está en la descripción.
    for (const keyword of CATEGORY_RULES[category]) {
      if (description.includes(keyword)) {
        return category; // Si la encontramos, devolvemos esa categoría y terminamos.
      }
    }
  }

  // Si el bucle termina y no hemos encontrado nada, devolvemos la categoría por defecto.
  return DEFAULT_CATEGORY;
};
