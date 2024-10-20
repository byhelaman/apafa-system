"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

import { format, set } from "date-fns"
import { es } from "date-fns/locale"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { toast } from "@/components/ui/use-toast"

export type User = {
  user_id: string,
  partner_id: string,
  name: string,
  email: string,
  reg_code: string,
  role: string,
  created_at: string,
}

export const createColumns = (refreshData: () => void): ColumnDef<User>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "created_at",
    header: "Creación",
    cell: ({ row }) => (
      <div className="capitalize">{format(row.getValue("created_at"), 'P', { locale: es })}</div>
    ),
  },
  {
    accessorKey: "name",
    header: "Usuario",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "role",
    header: "Rol",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("role")}</div>
    ),
  },
  {
    accessorKey: "reg_code",
    header: "Código de registro",
    cell: ({ row }) => (
      <div className="">{row.getValue("reg_code") ?? '---'}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original
      const [isOpen, setIsOpen] = useState(false)

      const fetchData = async (id: string) => {
        const response = await fetch('/api/users', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: id }),
        });
      };

      const handleAccept = async () => {
        await fetchData(user.user_id);
        setIsOpen(false);
        refreshData();
      };

      return (
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Editar</Button>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger>
              <Button variant="outline" size="sm">Eliminar</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar eliminación</DialogTitle>
                <DialogDescription>
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
                <Button onClick={handleAccept}>Eliminar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )
    },
  },
]