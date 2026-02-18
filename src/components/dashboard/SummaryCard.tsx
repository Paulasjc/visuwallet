type SummaryCardProps = {
  title: string;
  value: number;
};

export const SummaryCard = ({ title, value }: SummaryCardProps) => {
  const formattedValue = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);

  return (
    <div className="rounded-2xl border-2 border-[#ad7c92] bg-[#ffffff] shadow-sm overflow-hidden">
      <div className="px-6 pt-5 pb-2">
        <h3 className="text-sm font-medium tracking-wide text-[#784b5f]">{title}</h3>
      </div>
      <div className="px-6 pb-6">
        <p
          className={`text-2xl font-bold tracking-tight ${
            value >= 0 ? 'text-[#784b5f]' : 'text-[#ad7c92]'
          }`}
        >
          {formattedValue}
        </p>
      </div>
    </div>
  );
};