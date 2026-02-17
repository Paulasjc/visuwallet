import { SummaryCard } from './components/dashboard/SummaryCard'
import './App.css'
import { TransactionTable } from './components/dashboard/TransactionTable'
import type { Transaction } from './types';

function App() {

  const mockTransactions: Transaction[] = [
    { date: new Date('2024-02-17'), description: 'Compra en Mercadona', category: 'Alimentación', amount: -54.20 },
    { date: new Date('2024-02-16'), description: 'Nómina Febrero', category: 'Nómina', amount: 1800.00 },
    { date: new Date('2024-02-15'), description: 'Cena con amigos', category: 'Ocio', amount: -35.50 },
  ];
 

  return (
    <div className='p-8'>
      <h1>Mi Dashboard</h1>
      <div className='grid gap-4 md:grid-cols-3'>
      <SummaryCard title='Ingresos totales' value={2800} />
      <SummaryCard title="Gastos Totales" value={-750.20} />
      <SummaryCard title="Balance Neto" value={1050.55} />
      <TransactionTable transactions={mockTransactions} />


      </div>
      
    </div>
  )
}

export default App
