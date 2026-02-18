import { type ChartData } from "@/lib/chart-utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

type CategoryChartProps = {
  data: ChartData[];
};

export const CategoryChart = ({ data }: CategoryChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gastos por categoría</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {/* 2. Configura el componente Pie */}
          <Pie
            data={data}
            dataKey="value" // La propiedad de nuestros datos que contiene el valor numérico
            nameKey="name"   // La propiedad que contiene el nombre de la categoría
            cx="50%"         // Centra el gráfico horizontalmente
            cy="50%"         // Centra el gráfico verticalmente
            outerRadius={100} // El radio exterior del pastel
            fill="#8884d8"   // Un color de relleno por defecto
            label          // Muestra etiquetas en cada sección
          >
            {/* 3. Mapea los datos para asignar un color a cada celda (sección) */}
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          {/* 4. Añade el Tooltip para interactividad */}
          <Tooltip
            formatter={(value: number) =>
              new Intl.NumberFormat("es-ES", {
                style: "currency",
                currency: "EUR",
              }).format(value)
            }
          />
        </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
