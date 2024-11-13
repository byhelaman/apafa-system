"use client"

import { type ColumnDef } from "@tanstack/react-table"

import { Checkbox } from "@/components/ui/checkbox"

import { format, set } from "date-fns"
import { es } from "date-fns/locale"

export type ActUser = {
  activity_id: string,
  title: string,
  description: string,
  start_time: string,
  end_time: string,
  status: string,
  created_at: string,
}

export const createColumns = (refreshData: () => void): ColumnDef<ActUser>[] => [
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
    accessorKey: "activity_date",
    header: "",
    cell: ({ row }) => (
      <div>{format(row.getValue("activity_date"), 'P', { locale: es })}</div>
    ),
  },
  // {
  //   accessorKey: "activity_type",
  //   header: "Tipo",
  //   cell: ({ row }) => (
  //     <div className="capitalize">{row.getValue("activity_type")}</div>
  //   ),
  // },
  {
    accessorKey: "title",
    header: "Titulo",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "description",
    header: "Descripción",
    cell: ({ row }) => (
      <div>{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  }
]