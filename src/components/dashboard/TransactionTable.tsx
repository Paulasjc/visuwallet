import { type Transaction } from "@/types"
import {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
}
    from "../ui/table"

type TransactionTableProps = {
    transactions: Transaction[];
}


export const TransactionTable = ({ transactions }: TransactionTableProps) => {
    return (
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
                        <TableCell>{transaction.amount}</TableCell>
                    </TableRow>
                ))}

            </TableBody>

        </Table>
    )
}