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
import { format } from "date-fns"
import { es } from "date-fns/locale"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type Partner = {
  partner_id: string,
  identity_card: string,
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
  enrollment_date: string,
}

export const columns: ColumnDef<Partner>[] = [
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
    accessorKey: "enrollment_date",
    header: "Inscripción",
    cell: ({ row }) => (
      <div className="capitalize">{format(row.getValue("enrollment_date"), 'P', { locale: es })}</div>
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
    accessorKey: "children",
    header: "Registros",
    cell: ({ row }) => {
      const children = row.getValue("children") as [];
      return <div className="lowercase">+{children.length} hijo(s)</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const partner = row.original

      return (
        <Dialog>
          <DialogTrigger>
            <Button variant="outline" size="sm">Ver detalles</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{partner.identity_card}</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your account
                and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )
    },
  },
]
