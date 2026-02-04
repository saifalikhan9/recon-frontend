import React from 'react'
import { Card, CardContent } from '../ui/card'
import { CloudUpload } from 'lucide-react'

export const QuickUpload = () => {
    return (
        <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-10 text-center gap-2">
                <CloudUpload className="h-10 w-10 text-primary animate-pulse" />
                <p className="font-medium">Drag & drop CSV here</p>
                <p className="text-sm text-muted-foreground">
                    or click to upload
                </p>
            </CardContent>
        </Card>
    )
}
