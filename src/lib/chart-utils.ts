import { type Transaction } from "@/types";

// Definimos el tipo de salida que Recharts espera
export type ChartData = {
  name: string; // El nombre de la categoría
  value: number; // El total gastado en esa categoría (como número positivo)
};

export const prepareChartData = (transactions: Transaction[]): ChartData[] => {
  // Objeto para agrupar los gastos por categoría
  const categoryTotals: { [key: string]: number } = {};

  // 1. Recorremos todas las transacciones
  for (const transaction of transactions) {
    // Solo nos interesan los gastos (amount < 0)
    if (transaction.amount < 0) {
      const { category, amount } = transaction;
      
      // Si la categoría ya existe en nuestro objeto, le sumamos el gasto.
      // Si no existe, la inicializamos con el gasto actual.
      categoryTotals[category] = (categoryTotals[category] || 0) + Math.abs(amount); // Usamos Math.abs para convertir el gasto en un número positivo
    }
  }

  // 2. Convertimos el objeto de totales en el array que Recharts necesita
  const chartData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }));

  return chartData;
};
