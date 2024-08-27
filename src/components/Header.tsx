import { EllipsisVertical } from "lucide-react"
import { Button } from "@/components/ui/button"

import {
  DropdownMenu as Dropdown,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Nav } from "./Nav"

interface HeaderProps {
  data: {
    title?: string,
    isloggin: boolean,
    role: string
  }
}

interface DropDownProps {
  role: string
}

export function Header({ data, data: { title = '' } }: HeaderProps) {
  return (
    <header className={`flex ${data.isloggin ? "justify-between" : "justify-center"} items-center py-5`}>
      <a href="/"><h1 className="text-2xl uppercase font-bold">Apafa</h1></a>
      {data.isloggin &&
        <DropdownMenu role={data.role} />
      }
    </header>
  );
}

function DropdownMenu({ role = '' }: DropDownProps) {
  return (
    <Dropdown>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <EllipsisVertical className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36">
        <DropdownMenuGroup>
          {
            role === 'admin' &&
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span>Ajustes</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>
                    <a href="/members">Asociados</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <a href="/settings">Sistema</a>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          }
          <DropdownMenuItem>
            <a href="/search">Búsqueda</a>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <a href="/signout">Cerrar sesión</a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </Dropdown>
  )
}
