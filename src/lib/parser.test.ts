// src/lib/parser.test.ts

import { describe, it, expect } from 'vitest';
import { parseCsv } from './parser'; // La función que vamos a probar

// describe agrupa los tests para nuestra función parseCsv
describe('parseCsv', () => {

  // it define un caso de prueba específico: el caso feliz.
  it('should parse a valid CSV string and return an array of transactions', () => {
    // 1. ARRANGE
    const csvText = `Fecha,Concepto,Importe\n2024-01-15,Compra online,-75.50\n2024-01-16,Nómina,1800.00`;

    // 2. ACT
    const result = parseCsv({ csvText });

    // 3. ASSERT
    expect(result.errors).toHaveLength(0);
    expect(result.transactions).toHaveLength(2);
    expect(result.transactions[0]).toEqual({
      date: new Date('2024-01-15'),
      description: 'Compra online',
      amount: -75.50,
      category: 'Otros Gastos',
    });
    expect(result.transactions[1]).toEqual({
      date: new Date('2024-01-16'),
      description: 'Nómina',
      amount: 1800.00,
      category: 'Nómina',
    });
  });

  // NUEVO TEST: para filas con datos incompletos
  it('should skip rows with missing essential data', () => {
    // ARRANGE
    const csvText = `Fecha,Concepto,Importe\n2024-01-15,Compra online,-75.50\n2024-01-16,Nómina,\n2024-01-17,Cafetería,-3.20`;
  
    // ACT
    const result = parseCsv({ csvText });
  
    // ASSERT
    expect(result.errors).toHaveLength(0);
    expect(result.transactions).toHaveLength(2);
    expect(result.transactions[0].description).toBe('Compra online');
    expect(result.transactions[1].description).toBe('Cafetería');
  }); // <--- La llave de cierre del 'it'

}); // <--- La llave de cierre del 'describe'
