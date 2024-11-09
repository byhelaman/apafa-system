"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Check, Search, X } from "lucide-react"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

export type Partner = {
  partner_id: string,
  identity_card: string,
  reg_code: string,
  names: string,
  last_names: string,
  dob: string,
  phone: string,
  email: string,
  address: string,
  education_level: string,
  occupation: string,
  marital_status: string,
  children: [],
  status: string,
  created_at: string,
}

export const createColumns = (refreshData: () => void): ColumnDef<Partner>[] => [
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
    header: "",
    cell: ({ row }) => (
      <div className="capitalize">{format(row.getValue("created_at"), 'P', { locale: es })}</div>
    ),
  },
  {
    id: "full_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombres
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    accessorFn: (row) => `${row.names} ${row.last_names}`,
    cell: ({ row }) => {
      return (
        <div className="capitalize">
          {row.getValue("full_name")}
        </div>
      )
    }
  },
  {
    accessorKey: "identity_card",
    header: "Identificación",
    cell: ({ row }) => <div>DNI{row.getValue("identity_card")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const partner = row.original
      const [isOpen, setIsOpen] = useState(false)

      const fetchData = async (id: string) => {
        const response = await fetch('/api/users', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ partner_id: id }),
        });
      };

      const handleAccept = async () => {
        await fetchData(partner.partner_id);
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