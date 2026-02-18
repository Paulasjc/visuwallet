import { useState, useEffect } from 'react';
import { type Transaction } from '@/types';

const PAGE_SIZE = 8;

type TransactionTableProps = {
  transactions: Transaction[];
};

export const TransactionTable = ({ transactions }: TransactionTableProps) => {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [transactions]);

  const totalPages = Math.max(1, Math.ceil(transactions.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageTransactions = transactions.slice(start, start + PAGE_SIZE);

  return (
    <div className="rounded-2xl border-2 border-[#ad7c92] bg-[#ffffff] overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b-2 border-[#e4cedb] flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-medium tracking-wide text-[#784b5f]">Transacciones</h3>
          <p className="text-xs text-[#784b5f]/80 mt-0.5">Lista de tus movimientos recientes.</p>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-[#784b5f] bg-[#e4cedb] border-2 border-[#ad7c92] disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-[#ad7c92] hover:enabled:text-[#f6eff3] transition-colors text-lg font-medium leading-none"
              aria-label="Página anterior"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-[#784b5f] bg-[#e4cedb] border-2 border-[#ad7c92] disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-[#ad7c92] hover:enabled:text-[#f6eff3] transition-colors text-lg font-medium leading-none"
              aria-label="Página siguiente"
            >
              ›
            </button>
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm table-fixed">
          <thead>
            <tr className="bg-[#784b5f] text-[#f6eff3]">
              <th className="text-left font-medium py-3 px-4 w-24">Fecha</th>
              <th className="text-left font-medium py-3 px-4 w-56">Concepto</th>
              <th className="text-left font-medium py-3 px-4">Categoría</th>
              <th className="text-right font-medium py-3 px-4 w-28">Importe</th>
            </tr>
          </thead>
          <tbody>
            {pageTransactions.map((transaction, index) => (
              <tr
                key={start + index}
                className={
                  index % 2 === 0
                    ? 'bg-[#ffffff] text-[#784b5f] border-b border-[#e4cedb]'
                    : 'bg-[#e4cedb]/50 text-[#784b5f] border-b border-[#e4cedb]'
                }
              >
                <td className="py-3 px-4">{transaction.date.toLocaleDateString('es-ES')}</td>
                <td
                  className="py-3 px-4 w-56 truncate"
                  title={transaction.description}
                >
                  {transaction.description}
                </td>
                <td className="py-3 px-4">{transaction.category}</td>
                <td
                  className={`py-3 px-4 text-right font-medium tabular-nums ${
                    transaction.amount >= 0 ? 'text-[#784b5f]' : 'text-[#ad7c92]'
                  }`}
                >
                  {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(
                    transaction.amount
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};