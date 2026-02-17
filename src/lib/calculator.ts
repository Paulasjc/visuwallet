import { type Transaction } from "@/types";

export type SummaryData = {
    totalIncome: number;
    totalExpenses: number;
    netBalance: number;
}

export const calculateSummary = (transactions: Transaction[]): SummaryData => {

    // Sumar los ingresos
    const totalIncome = transactions
        .filter((t) => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = transactions
        .filter((t) => t.amount < 0)
        .reduce((sum, t) => sum + t.amount, 0)

    const netBalance = totalIncome + totalExpenses;


    return { totalIncome, totalExpenses, netBalance};
    
}