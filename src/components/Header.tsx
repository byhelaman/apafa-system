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

interface HeaderProps {
  isloggin?: boolean;
}

export function Header({ isloggin = false }: HeaderProps) {

  return (
    <header className={`px-6 flex ${isloggin ? "justify-between" : "justify-center"} items-center my-10`}>
      <h1 className="text-3xl uppercase font-bold">Apafa</h1>
      {isloggin &&
        <DropdownMenu />
      }
    </header>
  );
}

function DropdownMenu() {
  return (
    <Dropdown>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <EllipsisVertical className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36">
        <DropdownMenuGroup>
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
