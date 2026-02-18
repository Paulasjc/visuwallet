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
import { EmptyState } from './components/dashboard/EmptyState';

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
    <>
      {!loading && !error && !summaryData && (
        <EmptyState onFileSelected={handleFileSelected} />
      )}

      {loading && (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8" role="status" aria-live="polite">
          <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" aria-hidden />
          <p className="text-muted-foreground">Cargando y procesando datos...</p>
        </div>
      )}

      {error && (
        <div className="p-8 max-w-7xl mx-auto" role="alert">
          <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-6">
            <p className="font-semibold text-destructive">Error</p>
            <p className="mt-2 text-foreground">{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && summaryData && (
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-border bg-card px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <h1 className="text-xl font-semibold text-foreground">VisuWallet</h1>
              <button
                type="button"
                onClick={() => {
                  setTransactions([]);
                  setSummaryData(null);
                  setChartData([]);
                  setError(null);
                }}
                className="text-sm font-medium text-primary hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                Subir otro archivo
              </button>
            </div>
          </header>
          <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
            <section className="grid gap-4 md:grid-cols-3" aria-label="Resumen">
              <SummaryCard title="Ingresos Totales" value={summaryData.totalIncome} />
              <SummaryCard title="Gastos Totales" value={summaryData.totalExpenses} />
              <SummaryCard title="Balance Neto" value={summaryData.netBalance} />
            </section>
            <section className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-8" aria-label="Detalles">
              <div className="lg:col-span-3">
                <TransactionTable transactions={transactions} />
              </div>
              <div className="lg:col-span-2">
                <CategoryChart data={chartData} />
              </div>
            </section>
          </main>
        </div>
      )}
    </>
  );
}

export default App;
