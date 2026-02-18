import { type ColumnMapping } from '@/lib/parser';

type ColumnMappingFormProps = {
  headers: string[];
  mapping: ColumnMapping;
  onMappingChange: (mapping: ColumnMapping) => void;
};

const LABELS: Record<keyof ColumnMapping, string> = {
  date: 'Fecha',
  description: 'Concepto',
  amount: 'Importe',
};

export function ColumnMappingForm({ headers, mapping, onMappingChange }: ColumnMappingFormProps) {
  const handleChange = (role: keyof ColumnMapping, value: string) => {
    onMappingChange({
      ...mapping,
      [role]: value === '' ? null : value,
    });
  };

  if (headers.length === 0) return null;

  return (
    <div className="rounded-2xl border-2 border-[#ad7c92] bg-[#e4cedb] p-5">
      <p className="mb-3 text-sm font-medium text-[#784b5f] tracking-wide">Asignación de columnas</p>
      <div className="grid gap-3 sm:grid-cols-3">
        {(['date', 'description', 'amount'] as const).map((role) => (
          <label key={role} className="flex flex-col gap-1.5 text-sm">
            <span className="text-[#784b5f] font-medium">{LABELS[role]}</span>
            <select
              value={mapping[role] ?? ''}
              onChange={(e) => handleChange(role, e.target.value)}
              className="h-9 w-full rounded-xl border-2 border-[#ad7c92] bg-[#ffffff] px-3 py-1.5 text-sm text-[#784b5f] outline-none focus-visible:ring-2 focus-visible:ring-[#ad7c92] focus-visible:ring-offset-1"
              aria-label={`Columna para ${LABELS[role]}`}
            >
              <option value="">— Sin asignar —</option>
              {headers.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
    </div>
  );
}
