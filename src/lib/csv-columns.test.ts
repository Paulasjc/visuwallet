import { describe, it, expect } from 'vitest';
import { detectColumnMapping, getCsvHeaders, findHeaderRow } from './csv-columns';

describe('getCsvHeaders', () => {
  it('returns headers from first line (comma-separated)', () => {
    const csv = 'Fecha,Concepto,Importe\n2024-01-15,Compra,10';
    expect(getCsvHeaders(csv)).toEqual(['Fecha', 'Concepto', 'Importe']);
  });

  it('returns headers when semicolon-separated', () => {
    const csv = 'Date;Description;Amount\n2024-01-15;Shop;10';
    expect(getCsvHeaders(csv)).toEqual(['Date', 'Description', 'Amount']);
  });
});

describe('detectColumnMapping', () => {
  it('detects Spanish headers Fecha, Concepto, Importe', () => {
    const headers = ['Fecha', 'Concepto', 'Importe'];
    expect(detectColumnMapping(headers)).toEqual({
      date: 'Fecha',
      description: 'Concepto',
      amount: 'Importe',
    });
  });

  it('detects English headers Date, Description, Amount', () => {
    const headers = ['Date', 'Description', 'Amount'];
    expect(detectColumnMapping(headers)).toEqual({
      date: 'Date',
      description: 'Description',
      amount: 'Amount',
    });
  });

  it('detects mixed and extra columns', () => {
    const headers = ['Id', 'Transaction Date', 'Detail', 'Value', 'Balance'];
    expect(detectColumnMapping(headers)).toEqual({
      date: 'Transaction Date',
      description: 'Detail',
      amount: 'Value',
    });
  });

  it('detects with accents and case insensitivity', () => {
    const headers = ['FECHA OPERACIÓN', 'Descripción', 'IMPORTE'];
    expect(detectColumnMapping(headers)).toEqual({
      date: 'FECHA OPERACIÓN',
      description: 'Descripción',
      amount: 'IMPORTE',
    });
  });

  it('returns null for role when no header matches', () => {
    const headers = ['Columna A', 'Columna B', 'Columna C'];
    expect(detectColumnMapping(headers)).toEqual({
      date: null,
      description: null,
      amount: null,
    });
  });

  it('detects when only some columns match', () => {
    const headers = ['Fecha', 'Otra cosa', 'Importe'];
    expect(detectColumnMapping(headers)).toEqual({
      date: 'Fecha',
      description: null,
      amount: 'Importe',
    });
  });
});

describe('findHeaderRow', () => {
  it('finds header row when it is not the first line (e.g. Santander)', () => {
    const csv = [
      'Santander',
      '',
      'Movimientos',
      '',
      'Fecha operación,Fecha valor,Concepto,Importe,Saldo,Divisa',
      '01/02/2026,01/02/2026,Algo,-10,50,100,EUR',
    ].join('\n');
    const { headers, lineIndex } = findHeaderRow(csv);
    expect(lineIndex).toBe(4);
    expect(headers).toContain('Fecha operación');
    expect(headers).toContain('Concepto');
    expect(headers).toContain('Importe');
  });

  it('uses first line when it already has valid headers', () => {
    const csv = 'Fecha,Concepto,Importe\n2024-01-15,Compra,-10';
    const { headers, lineIndex } = findHeaderRow(csv);
    expect(lineIndex).toBe(0);
    expect(headers).toEqual(['Fecha', 'Concepto', 'Importe']);
  });
});
