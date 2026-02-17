// src/lib/chart-utils.test.ts

import { describe, it, expect } from 'vitest';
import { type Transaction } from '@/types';
import { prepareChartData } from './chart-utils';

describe('prepareChartData', () => {
  
  // Lo definimos una sola vez para todo el 'describe'
  const testTransactions: Transaction[] = [
    { date: new Date(), description: 'Mercadona', amount: -54.20, category: 'Alimentación' },
    { date: new Date(), description: 'Nómina', amount: 1800.00, category: 'Nómina' },
    { date: new Date(), description: 'Cena', amount: -35.50, category: 'Ocio' },
    { date: new Date(), description: 'Lidl', amount: -30.00, category: 'Alimentación' },
    { date: new Date(), description: 'Cine', amount: -12.00, category: 'Ocio' },
  ];

  it('should group expenses by category, sum their absolute values, and ignore incomes', () => {
    // ACT: Llamamos a la función una sola vez
    const chartData = prepareChartData(testTransactions);

    // ASSERT 1: Verificar que solo hay 2 categorías de gastos
    expect(chartData).toHaveLength(2);

    // ASSERT 2: Verificar los datos de la categoría 'Alimentación'
    const alimentacionData = chartData.find(item => item.name === 'Alimentación');
    expect(alimentacionData).toBeDefined(); // Nos aseguramos de que existe
    expect(alimentacionData?.value).toBeCloseTo(84.20); // 54.20 + 30.00

    // ASSERT 3: Verificar los datos de la categoría 'Ocio'
    const ocioData = chartData.find(item => item.name === 'Ocio');
    expect(ocioData).toBeDefined(); // Nos aseguramos de que existe
    expect(ocioData?.value).toBeCloseTo(47.50); // 35.50 + 12.00

    // ASSERT 4: Verificar que la categoría de ingresos 'Nómina' no está presente
    const nominaData = chartData.find(item => item.name === 'Nómina');
    expect(nominaData).toBeUndefined();
  });
});
