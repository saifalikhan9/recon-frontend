import { Card, CardContent } from '@/src/components/ui/card'

export function StatCard({
    title,
    value,
    className,
}: {
    title: string
    value: string
    className?: string
}) {
    return (
        <Card>
            <CardContent className="p-6">

                <p className="text-sm text-muted-foreground">{title}</p>
                <p className={`text-2xl font-bold ${className}`}>{value}</p>
            </CardContent>
        </Card>
    )
}
