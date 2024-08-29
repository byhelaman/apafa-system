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
  data: {
    title?: string,
    isLoggedIn: boolean,
    role: string
  }
}

interface DropDownProps {
  role: string
}

export function Header({ data, data: { title = '' } }: HeaderProps) {
  return (
    <header className={`flex ${data.isLoggedIn ? "justify-between" : "justify-center"} items-center py-5`}>
      <a href="/"><h1 className="text-2xl uppercase font-bold">Apafa</h1></a>
      {data.isLoggedIn &&
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
                    <a href="/members" className="w-full">Asociados</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <a href="/settings" className="w-full">Sistema</a>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          }
          <DropdownMenuItem>
            <a href="/search" className="w-full">Búsqueda</a>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <a href="/signout" className="w-full">Cerrar sesión</a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </Dropdown>
  )
}
