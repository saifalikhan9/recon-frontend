import { Button } from "@/src/components/ui/button"

export function SidebarItem({
  icon,
  label,
}: {
  icon: React.ReactNode
  label: string
}) {
  return (
    <Button variant="ghost" className="w-full justify-start gap-2">
      {icon}
      {label}
    </Button>
  )
}