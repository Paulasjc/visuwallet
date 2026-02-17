import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";


type SummaryCardProps = {
    title: string;
    value: number;
    
}

export const SummaryCard = ({title, value}: SummaryCardProps) => {
    const formattedValue = new Intl.NumberFormat('es-ES', {style: "currency", currency: "EUR"}).format(value)
    return(
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className={ `text-2xl font-bold ${value >= 0 ? 'text-green-600' : 'text-red-600'}`
                }>{formattedValue}</p>
            </CardContent>

        </Card>
    )
}