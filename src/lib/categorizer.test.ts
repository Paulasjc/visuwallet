import { describe, it, expect } from 'vitest';
import { categorizeTransaction } from './categorizer';
import { type Transaction } from '@/types'; // Necesitarás esto para crear tus pruebas

// --- LA FICHA DEL CASO ---
describe('categorizeTransaction', () => {

  // --- PRIMERA PREGUNTA ---
  it('should return "Compras" for a description containing "amazon"', () => {
    
    // 1. ARRANGE (Preparar la Escena)
    // Crea una transacción de prueba. No necesitas todos los campos, solo 'description'.
    // El resto pueden ser valores falsos (mock).
    const testTransaction: Transaction = {
        date: new Date(),
        description: 'compra auriculares amazon.com',
        amount: 0,
        category: ''

      
    };

    // 2. ACT (Hacer la Pregunta)
    // Llama a la función 'categorizeTransaction' con tu transacción de prueba.
    // Guarda la respuesta en una variable.
    const category = categorizeTransaction(testTransaction);

    // 3. ASSERT (Verificar la Respuesta)
    expect(category).toBe('Compras')
  });

  // --- SEGUNDA PREGUNTA (Un poco más difícil) ---
  it('should return "Nómina" for a description containing "ingreso" in uppercase', () => {
    
    // ARRANGE: Crea una transacción con una descripción como "INGRESO NOMINA ENERO"
    const testTransaction: Transaction = {
        date: new Date(),
        description: 'INGRESO NOMINA ENERO',
        amount: 0,
        category: ''
    };

    // ACT: Llama a la función
    const category = categorizeTransaction(testTransaction);

    // ASSERT: Comprueba que la categoría es "Nómina"
    expect(category).toBe("Nómina");
  });

  // --- TERCERA PREGUNTA (El caso por defecto) ---
  it('should return "Otros Gastos" when no keyword matches', () => {
    
    const testTransaction: Transaction = {
        date: new Date(),
        description: "Recibo de la comunidad",
        amount: 0,
        category: ''
    }

    const category = categorizeTransaction(testTransaction);

    expect(category).toBe("Otros Gastos")
  });

});
