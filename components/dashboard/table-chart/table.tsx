import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import React from 'react'

export const TableChart = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* RECENT ACTIVITY */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Txn ID</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>TX_123</TableCell>
                                <TableCell>$500</TableCell>
                                <TableCell className="text-green-600">
                                    Matched
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>TX_124</TableCell>
                                <TableCell>$20</TableCell>
                                <TableCell className="text-red-500">
                                    Unmatched
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* MATCH RATE CHART (Placeholder) */}
            <Card>
                <CardHeader>
                    <CardTitle>Match Rate</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-56">
                    <div className="relative h-32 w-32 rounded-full border-[10px] border-green-500 border-t-orange-400 border-r-red-400" />
                </CardContent>
            </Card>
        </div>
    )
}
