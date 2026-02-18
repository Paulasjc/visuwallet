import { type Transaction } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "../ui/table";

type TransactionTableProps = {
  transactions: Transaction[];
};

export const TransactionTable = ({ transactions }: TransactionTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transacciones</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
            <TableCaption>Una lista de tus transacciones recientes.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Concepto</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead className="text-right">Importe</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {transactions.map((transaction, index) => (
                    <TableRow key={index}>
                        <TableCell>{transaction.date.toLocaleDateString('es-ES')}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>{transaction.category}</TableCell>
                        <TableCell className="text-right font-medium tabular-nums">
                        {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(transaction.amount)}
                      </TableCell>
                    </TableRow>
                ))}

            </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};