import { SummaryCard } from './components/dashboard/SummaryCard'
import './App.css'

function App() {
 

  return (
    <div className='p-8'>
      <h1>Mi Dashboard</h1>
      <div className='grid gap-4 md:grid-cols-3'>
      <SummaryCard title='Ingresos totales' value={2800} />
      <SummaryCard title="Gastos Totales" value={-750.20} />
      <SummaryCard title="Balance Neto" value={1050.55} />

      </div>
      
    </div>
  )
}

export default App
