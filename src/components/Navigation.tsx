import { ArrowLeft, ArrowUpRight, Equal, Plus, UserRoundPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/ModeToggle";

import {
  DropdownMenu as Dropdown,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface HeaderProps {
  role?: string
  name?: string
  path?: string
}

export function Navigation({ role, name, path }: HeaderProps) {

  return (
    <header className="sticky top-5 h-10 px-6 z-50">
      <nav className="h-full border rounded-md flex items-center justify-between gap-2 px-4 pr-1 bg-background ">
        <a href="/" className="text-sm font-semibold">APAFA145</a>
        <div className="flex items-center gap-1">
          <ModeToggle />
          <Button variant="secondary" className="h-8" onClick={() => window.location.href = '/intranet'}>
            Intranet
          </Button>
        </div>
      </nav>
    </header>
  )
}
