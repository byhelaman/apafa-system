import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { EllipsisVertical } from "lucide-react"

export default function DropDown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVertical className="h-4 w-4" size={16} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <form action="/api/auth/signout">
            <button type="submit">Cerrar sesión</button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

