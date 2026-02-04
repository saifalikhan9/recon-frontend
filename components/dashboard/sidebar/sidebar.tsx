import React from 'react'
import { SidebarItem } from './sidebar-nav'
import { CloudUpload, LayoutDashboard, LogOut, Settings, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Sidebar = () => {
    return (
        <aside className="w-64 border-r bg-background p-4 flex flex-col justify-between">
            <div>
                <h2 className="text-xl font-bold mb-6">🔍 ReconSys</h2>

                <nav className="space-y-2">
                    <SidebarItem icon={<LayoutDashboard size={18} />} label="Dashboard" />
                    <SidebarItem icon={<Upload size={18} />} label="Reconciliation" />
                    <SidebarItem icon={<CloudUpload size={18} />} label="Upload" />
                    <SidebarItem icon={<Settings size={18} />} label="Settings" />
                </nav>
            </div>

            <Button variant="ghost" className="justify-start gap-2">
                <LogOut size={18} /> Logout
            </Button>
        </aside>
    )
}
