import { ChevronsUpDown, Copy } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useState } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

export function Dashboard() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Header />
      <main className="px-6 my-10">
        <div className="flex gap-3 flex-col sm:flex-row">
          <div className="flex flex-col gap-3 w-full">
            <Card className="bg-white h-fit">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-normal">
                  <span className="font-semibold">shadcn/ui</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Beautifully designed components that you can copy and paste
                  into your apps. Accessible. Customizable. Open Source.
                </p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <Badge variant="secondary" className="rounded-full">
                    TypeScript
                  </Badge>
                  <span>Updated April 2023</span>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card className="w-full h-fit">
            <CardHeader className="flex flex-row items-start bg-muted/50">
              <div className="grid gap-0.5">
                <CardTitle className="flex items-center gap-2 text-lg">
                  Juan Carlos Pérez García
                </CardTitle>
                <CardDescription>
                  123e4567-e89b-12d3-a456-426614174000
                </CardDescription>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <Button size="icon" variant="outline" className="h-8 w-8">
                  <Copy className="h-3.5 w-3.5" />
                  <span className="sr-only">Copy ID</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 text-sm">
              <div className="grid gap-3">
                <div className="font-semibold">Información Personal</div>
                <ul className="grid gap-4 grid-cols-2">
                  <li className="flex flex-col gap-1">
                    <span className="text-muted-foreground">
                      Código de Registro
                    </span>
                    <span>CR00056</span>
                  </li>
                  <li className="flex flex-col gap-1">
                    <span className="text-muted-foreground">
                      Indentificación
                    </span>
                    <span>DNI12345678</span>
                  </li>
                  <li className="flex flex-col gap-1">
                    <span className="text-muted-foreground">Estado Civil</span>
                    <span>Soltero</span>
                  </li>
                  <li className="flex flex-col gap-1">
                    <span className="text-muted-foreground">
                      Fecha de Nacimiento
                    </span>
                    <span>1990-05-15</span>
                  </li>
                  <li className="flex flex-col gap-1">
                    <span className="text-muted-foreground">Teléfono</span>
                    <span>+51 987 654 321</span>
                  </li>
                  <li className="flex flex-col gap-1">
                    <span className="text-muted-foreground">
                      Correo electrónico
                    </span>
                    <span>juan.perez@example.com</span>
                  </li>
                  <li className="flex flex-col gap-1">
                    <span className="text-muted-foreground">Dirección</span>
                    <span>Av. Principal 123, Lima, Perú</span>
                  </li>
                  <li className="flex flex-col gap-1">
                    <span className="text-muted-foreground">
                      Nivel de Educación
                    </span>
                    <span>Universidad</span>
                  </li>
                  <li className="flex flex-col gap-1">
                    <span className="text-muted-foreground">Ocupación</span>
                    <span>Ingeniero Civil</span>
                  </li>
                </ul>
              </div>
              <Separator className="my-4" />
              <div className="grid gap-3">
                <Collapsible
                  open={isOpen}
                  onOpenChange={setIsOpen}
                  className="w-full space-y-2"
                >
                  <div className="flex items-center justify-between space-x-4">
                    <span className="text-sm font-semibold">
                      Estudiantes a cargo
                    </span>
                    <CollapsibleTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <ChevronsUpDown className="h-3.5 w-3.5" />
                        <span className="sr-only">Toggle</span>
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <div className="rounded-md border px-4 py-3 text-sm">
                    @student
                  </div>
                  <CollapsibleContent className="space-y-2">
                    <div className="rounded-md border px-4 py-3 text-sm">
                      @student
                    </div>
                    <div className="rounded-md border px-4 py-3 text-sm">
                      @student
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </CardContent>
            <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
              <div className="w-full text-xs text-muted-foreground flex justify-between gap-4">
                <span>Fecha de Creación: 15/6/2023, 17:30</span>
                <span>Activo</span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </>
  )
}

function Header() {
  return (
    <header className="sticky top-5  gap-4 bg-background px-4 md:px-6">
      <div className="flex w-full h-10 items-center justify-between border rounded-lg px-2 pl-4">
        <nav className="font-bold text-sm ">
          <a
            href="#"
            className="text-foreground transition-colors hover:text-foreground"
          >
            APAFA145
          </a>
        </nav>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm" className="h-auto py-1">
              @menu
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>@name</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <a href="/signout">Cerrar Sesión</a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
