"use client"

import {
    Bell,
    CloudUpload,
    LayoutDashboard,
    LogOut,
    Settings,
    Upload,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sidebar } from "@/components/dashboard/sidebar/sidebar"
import { Stats } from "@/components/dashboard/stats/Stats"
import { QuickUpload } from "@/components/dashboard/QuickUpload"
import { TableChart } from "@/components/dashboard/table-chart/table"
import { Nav } from "@/components/dashboard/nav/Nav"

export default function DashboardPage() {
    return (
        <div className="flex min-h-screen bg-muted/40">
            <Sidebar />
            <main className="flex-1 p-6 space-y-6">
                <Nav />
                <Stats />
                <QuickUpload />
                <TableChart />
            </main>
        </div>
    )
}





