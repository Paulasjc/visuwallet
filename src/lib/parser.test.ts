import { describe, it, expect } from 'vitest';
import { parseCsv } from './parser';

describe('parseCsv', () => {
  it('parses CSV with Spanish headers Fecha, Concepto, Importe (auto-detect)', () => {
    const csvText = `Fecha,Concepto,Importe\n2024-01-15,Compra online,-75.50\n2024-01-16,Nómina,1800.00`;

    const result = parseCsv({ csvText });

    expect(result.errors).toHaveLength(0);
    expect(result.transactions).toHaveLength(2);
    expect(result.transactions[0]).toMatchObject({
      description: 'Compra online',
      amount: -75.5,
      category: 'Otros Gastos',
    });
    expect(result.transactions[0].date).toEqual(new Date('2024-01-15'));
    expect(result.transactions[1]).toMatchObject({
      description: 'Nómina',
      amount: 1800,
      category: 'Nómina',
    });
    expect(result.transactions[1].date).toEqual(new Date('2024-01-16'));
  });

  it('parses CSV with English headers when mapping is provided', () => {
    const csvText = `Date,Description,Amount\n2024-01-15,Shop,-50\n2024-01-16,Salary,2000`;
    const result = parseCsv({
      csvText,
      columnMapping: { date: 'Date', description: 'Description', amount: 'Amount' },
    });

    expect(result.transactions).toHaveLength(2);
    expect(result.transactions[0].description).toBe('Shop');
    expect(result.transactions[0].amount).toBe(-50);
    expect(result.transactions[1].description).toBe('Salary');
    expect(result.transactions[1].amount).toBe(2000);
  });

  it('parses European amount format (1.234,56) with semicolon delimiter', () => {
    const csvText = `Fecha;Concepto;Importe\n15/01/2024;Compra;1.234,56`;
    const result = parseCsv({
      csvText,
      columnMapping: { date: 'Fecha', description: 'Concepto', amount: 'Importe' },
    });

    expect(result.transactions).toHaveLength(1);
    expect(result.transactions[0].amount).toBe(1234.56);
  });

  it('parses DD/MM/YYYY date and European decimal amount', () => {
    const csvText = `Fecha;Concepto;Importe\n15/01/2024;Café;-3,50`;
    const result = parseCsv({
      csvText,
      columnMapping: { date: 'Fecha', description: 'Concepto', amount: 'Importe' },
    });

    expect(result.transactions).toHaveLength(1);
    expect(result.transactions[0].date).toEqual(new Date(2024, 0, 15));
    expect(result.transactions[0].amount).toBe(-3.5);
  });

  it('skips rows with missing essential data', () => {
    const csvText = `Fecha,Concepto,Importe\n2024-01-15,Compra online,-75.50\n2024-01-16,Nómina,\n2024-01-17,Cafetería,-3.20`;

    const result = parseCsv({ csvText });

    expect(result.errors).toHaveLength(0);
    expect(result.transactions).toHaveLength(2);
    expect(result.transactions[0].description).toBe('Compra online');
    expect(result.transactions[1].description).toBe('Cafetería');
  });

  it('returns empty transactions when headers do not match any column role', () => {
    const csvText = `ColumnaX,ColumnaY,ColumnaZ\n1,2,3`;
    const result = parseCsv({ csvText });

    expect(result.transactions).toHaveLength(0);
  });
});
