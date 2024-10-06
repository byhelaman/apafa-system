import { ArrowLeft, ArrowUpRight, Equal, Plus, UserRoundPlus } from "lucide-react"
import { Button } from "@/components/ui/button"

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
}

export function Header({ role, name }: HeaderProps) {

  return (
    <header className="sticky top-5 h-10 px-6">
      <nav className="h-full border rounded-md flex items-center justify-between gap-2 px-4 pr-1.5 bg-background ">
        <a href="/" className="text-sm font-semibold">APAFA145</a>
        {
          role ? (
            <Dropdown>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-auto p-2 aspect-square">
                  <Equal className="h-3.5 w-3.5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{name}</DropdownMenuLabel>
                <DropdownMenuGroup>
                  {role === 'admin' && (
                    <DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuSubTrigger>
                        <span>Ajustes</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem>
                            <span>Actividades</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <span>Asociados</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <a href="/register">Nuevo registro</a>
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <a href="/signout">Cerrar Sesión</a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </Dropdown>
          ) : (
            <Button variant="ghost" className="h-auto p-2 aspect-square" onClick={() => window.location.href = '/'}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          )
        }
      </nav>
    </header>
  )
}
