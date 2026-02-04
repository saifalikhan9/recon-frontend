import Sidebar from "@/components/dashboard/sidebar/sidebar";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-950">
            <Sidebar />
            {/* This margin-left (ml-64) pushes your page content 
        to the right so it doesn't hide behind the sidebar. 
      */}
            <main className="ml-64 min-h-screen bg-[url('/bg-grid.svg')] bg-fixed">
                {/* We add a subtle gradient overlay to make the content pop */}
                <div className="relative min-h-screen bg-slate-950/80 p-8 backdrop-blur-[2px]">
                    {children}
                </div>
            </main>
        </div>
    );
}