import { useState, useCallback } from 'react';

import { type Transaction } from './types';
import { parseCsv, type ColumnMapping } from './lib/parser';
import { getCsvHeaders, detectColumnMapping } from './lib/csv-columns';
import { calculateSummary, type SummaryData } from './lib/calculator';
import { prepareChartData, type ChartData } from './lib/chart-utils';

import { SummaryCard } from './components/dashboard/SummaryCard';
import { TransactionTable } from './components/dashboard/TransactionTable';
import { CategoryChart } from './components/dashboard/CategoryChart';
import { ColumnMappingForm } from './components/dashboard/ColumnMappingForm';
import { EmptyState } from './components/dashboard/EmptyState';

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [csvText, setCsvText] = useState<string | null>(null);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping | null>(null);

  const applyParse = useCallback((text: string, mapping: ColumnMapping | null) => {
    const parsed = parseCsv({ csvText: text, columnMapping: mapping ?? undefined });
    setTransactions(parsed.transactions);
    setSummaryData(calculateSummary(parsed.transactions));
    setChartData(prepareChartData(parsed.transactions));
  }, []);

  const handleFileSelected = (fileContent: string) => {
    setLoading(true);
    setError(null);
    try {
      setCsvText(fileContent);
      const headers = getCsvHeaders(fileContent);
      const detected = detectColumnMapping(headers);
      setColumnMapping(detected);
      applyParse(fileContent, detected);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error desconocido.';
      setError(errorMessage);
      setCsvText(null);
      setColumnMapping(null);
      setTransactions([]);
      setSummaryData(null);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMappingChange = useCallback(
    (mapping: ColumnMapping) => {
      setColumnMapping(mapping);
      if (csvText) applyParse(csvText, mapping);
    },
    [csvText, applyParse]
  );

  const showEmpty = !loading && !error && csvText === null;
  const showDashboard = !loading && !error && csvText !== null;
  const headers = csvText ? getCsvHeaders(csvText) : [];

  return (
    <>
      {showEmpty && <EmptyState onFileSelected={handleFileSelected} />}

      {loading && (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 bg-[#975f78]" role="status" aria-live="polite">
          <div className="h-10 w-10 rounded-full border-2 border-[#f6eff3] border-t-transparent animate-spin" aria-hidden />
          <p className="text-[#f6eff3] text-sm">Cargando y procesando datos...</p>
        </div>
      )}

      {error && (
        <div className="min-h-screen flex items-start justify-center p-8 bg-[#975f78]" role="alert">
          <div className="rounded-2xl border-2 border-[#ad7c92] bg-[#e4cedb] p-6 max-w-xl w-full">
            <p className="font-semibold text-[#784b5f]">Error</p>
            <p className="mt-2 text-[#784b5f]">{error}</p>
          </div>
        </div>
      )}

      {showDashboard && (
        <div className="min-h-screen flex flex-col bg-[#975f78]">
          <header className="border-b-2 border-[#ad7c92] px-6 py-4 bg-[#975f78]">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/visuwallet-icon-2.png" alt="" className="h-8 w-8 object-contain" />
                <h1 className="text-xl font-semibold text-[#f6eff3] tracking-wide">VisuWallet</h1>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCsvText(null);
                  setColumnMapping(null);
                  setTransactions([]);
                  setSummaryData(null);
                  setChartData([]);
                  setError(null);
                }}
                className="text-sm font-medium text-[#f6eff3] hover:text-[#e4cedb] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#f6eff3] rounded-md px-3 py-1.5 transition-colors"
              >
                Subir otro archivo
              </button>
            </div>
          </header>
          <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
            <section className="mb-6" aria-label="Asignación de columnas">
              <ColumnMappingForm
                headers={headers}
                mapping={columnMapping ?? { date: null, description: null, amount: null }}
                onMappingChange={handleMappingChange}
              />
            </section>
            {transactions.length === 0 ? (
              <p className="text-[#f6eff3] text-sm">
                No se encontraron transacciones. Revisa la asignación de columnas arriba o el formato del archivo.
              </p>
            ) : (
              <>
                <section className="grid gap-4 md:grid-cols-3" aria-label="Resumen">
                  <SummaryCard title="Ingresos Totales" value={summaryData!.totalIncome} />
                  <SummaryCard title="Gastos Totales" value={summaryData!.totalExpenses} />
                  <SummaryCard title="Balance Neto" value={summaryData!.netBalance} />
                </section>
                <section className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-8" aria-label="Detalles">
                  <div className="lg:col-span-3">
                    <TransactionTable transactions={transactions} />
                  </div>
                  <div className="lg:col-span-2">
                    <CategoryChart data={chartData} />
                  </div>
                </section>
              </>
            )}
          </main>
        </div>
      )}
    </>
  );
}

export default App;
