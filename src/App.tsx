import { useState } from 'react';

// Importaciones de nuestros tipos y lógica
import { type Transaction } from './types';
import { parseCsv } from './lib/parser';
import { calculateSummary, type SummaryData } from './lib/calculator';
import { prepareChartData, type ChartData } from './lib/chart-utils';

// Importaciones de nuestros componentes de UI
import { SummaryCard } from './components/dashboard/SummaryCard';
import { TransactionTable } from './components/dashboard/TransactionTable';
import { CategoryChart } from './components/dashboard/CategoryChart';
import { FileUpload } from './components/dashboard/FileUpload';

function App() {
  // --- ESTADOS DE LA APLICACIÓN ---
  // Estados para los datos del dashboard
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  // Estados para la experiencia de usuario (carga y errores)
  const [loading, setLoading] = useState(false); // Empieza en 'false'
  const [error, setError] = useState<string | null>(null);

  // --- MANEJADOR DE EVENTOS ---
  const handleFileSelected = (fileContent: string) => {
    // 1. Inicia el proceso: activa el loading y limpia errores antiguos
    setLoading(true);
    setError(null);

    // Usamos un bloque try...catch para manejar posibles fallos en el procesamiento
    try {
      // 2. Procesamiento de datos
      const parsedData = parseCsv({ csvText: fileContent });

      // Comprobación de robustez: si el CSV está vacío o no tiene datos válidos
      if (parsedData.transactions.length === 0) {
        throw new Error("No se encontraron transacciones válidas en el archivo. Revisa el formato del CSV.");
      }

      const summary = calculateSummary(parsedData.transactions);
      const chart = prepareChartData(parsedData.transactions);

      // 3. Si todo va bien, actualizamos los estados con los nuevos datos
      setTransactions(parsedData.transactions);
      setSummaryData(summary);
      setChartData(chart);

    } catch (err) {
      // 4. Si algo falla en el 'try', capturamos el error
      const errorMessage = err instanceof Error ? err.message : "Ocurrió un error desconocido.";
      setError(errorMessage);
      
      // Y limpiamos cualquier dato antiguo que pudiera haber en pantalla
      setTransactions([]);
      setSummaryData(null);
      setChartData([]);

    } finally {
      // 5. Al final, haya ido bien o mal, desactivamos el estado de carga
      setLoading(false);
    }
  };

  // --- RENDERIZADO DEL COMPONENTE ---
  return (
    <div className='p-8 max-w-7xl mx-auto'> {/* Centramos el contenido y le damos un ancho máximo */}
      <header className='mb-8'>
        <h1 className='text-4xl font-bold text-gray-800'>VisuWallet</h1>
        <p className='text-gray-500'>Transforma tus extractos bancarios en claridad financiera.</p>
      </header>
      
      <FileUpload onFileSelected={handleFileSelected} />

      {/* Muestra el indicador de carga si está activo */}
      {loading && <p className="mt-4 text-blue-600">Cargando y procesando datos...</p>}

      {/* Muestra el mensaje de error si existe */}
      {error && <p className="mt-4 text-red-600 font-semibold">Error: {error}</p>}

      {/* Contenedor del Dashboard: solo se muestra si no hay carga, no hay error y hay datos */}
      {!loading && !error && summaryData && (
        <main className='mt-8'>
          {/* Sección de Resumen */}
          <div className='grid gap-4 md:grid-cols-3'>
            <SummaryCard title='Ingresos Totales' value={summaryData.totalIncome} />
            <SummaryCard title="Gastos Totales" value={summaryData.totalExpenses} />
            <SummaryCard title="Balance Neto" value={summaryData.netBalance} />
          </div>

          {/* Sección de Detalles */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mt-8">
            <div className="lg:col-span-3">
              <TransactionTable transactions={transactions} />
            </div>
            <div className="lg:col-span-2">
              <CategoryChart data={chartData} />
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

export default App;
