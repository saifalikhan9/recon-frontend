import React from 'react'
import { StatCard } from './StatsCard'

export const Stats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    <StatCard title="Total Records" value="50,200" />
    <StatCard title="Matched" value="85%" className="text-green-600" />
    <StatCard title="Pending" value="15%" className="text-orange-500" />
    <StatCard title="Accuracy" value="98.5%" />
</div>
  )
}
