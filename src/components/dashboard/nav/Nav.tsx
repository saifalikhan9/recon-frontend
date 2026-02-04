import { Avatar, AvatarFallback } from '@/src/components/ui/avatar'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Bell } from 'lucide-react'

export const Nav = () => {
    return (
        <div className="flex items-center justify-between">
            <Input
                placeholder="Search transactions..."
                className="max-w-sm"
            />

            <div className="flex items-center gap-4">
                <Button size="icon" variant="ghost">
                    <Bell size={18} />
                </Button>
                <Avatar>
                    <AvatarFallback>SA</AvatarFallback>
                </Avatar>
            </div>
        </div>
    )
}
