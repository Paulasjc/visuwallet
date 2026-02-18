import type { Transaction } from "@/types";
import { calculateSummary } from "./calculator";
import { describe, it, expect } from 'vitest';

// Estrategia 2: Múltiples 'it'
describe('calculateSummary', () => {
    // ARRANGE: Sí, puedes definir la constante fuera de los 'it' para que todos la usen.
    const testTransactions: Transaction[] = [
        { date: new Date(), description: 'Nómina', amount: 2000, category: 'Nómina' },
        { date: new Date(), description: 'Alquiler', amount: -800, category: 'Vivienda' },
        { date: new Date(), description: 'Venta Wallapop', amount: 50, category: 'Ingresos Extra' },
    ];
  
    it('should calculate the total income correctly', () => {
      const result = calculateSummary(testTransactions);
      expect(result.totalIncome).toBe(2050);
    });
  
    it('should calculate the total expenses correctly', () => {
      const result = calculateSummary(testTransactions);
      expect(result.totalExpenses).toBe(-800);
    });
  
    it('should calculate the net balance correctly', () => {
      const result = calculateSummary(testTransactions);
      expect(result.netBalance).toBe(1250);
    });
  });
  