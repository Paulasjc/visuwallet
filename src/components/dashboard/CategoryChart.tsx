import { type ChartData } from '@/lib/chart-utils';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const COLORS = ['#784b5f', '#ad7c92', '#e4cedb', '#975f78', '#f6eff3'];

type CategoryChartProps = {
  data: ChartData[];
};

export const CategoryChart = ({ data }: CategoryChartProps) => {
  return (
    <div className="rounded-2xl border-2 border-[#ad7c92] bg-[#ffffff] overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b-2 border-[#e4cedb]">
        <h3 className="text-sm font-medium tracking-wide text-[#784b5f]">Gastos por categoría</h3>
      </div>
      <div className="p-4">
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#ad7c92"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) =>
                  new Intl.NumberFormat('es-ES', {
                    style: 'currency',
                    currency: 'EUR',
                  }).format(value)
                }
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '2px solid #ad7c92',
                  borderRadius: '12px',
                  color: '#784b5f',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
