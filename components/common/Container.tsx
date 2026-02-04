import { cn } from '@/lib/utils'
import React from 'react'

export const Container = ({ className, children }: {
    className?: string,
    children: React.ReactElement
}) => {
    return (
        <div className={cn(className, 'mx-auto max-w-6xl bg-neutral-200 min-h-screen flex items-center justify-center')}>{children}</div>
    )
}
