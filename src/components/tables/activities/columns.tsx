"use client"

import { useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { ArrowUpDown, Pencil, Trash2 } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type Activity = {
  activity_id: string
  title: string
  description: string
  activity_type: string
  activity_date: string | null
  start_time: string | null
  end_time: string | null
  location: string
  status: string
  created_at: string
}

export const createColumns = (refreshData: () => void): ColumnDef<Activity>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div>{format(new Date(row.getValue("activity_date")), 'P', { locale: es })}</div>
    ),
  },
  {
    accessorKey: "activity_type",
    header: "Tipo",
    cell: ({ row }) => <div className="capitalize">{row.getValue("activity_type")}</div>,
  },
  {
    accessorKey: "title",
    header: "Título",
    cell: ({ row }) => <div className="capitalize">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "description",
    header: "Descripción",
    cell: ({ row }) => <div>{row.getValue("description")}</div>,
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionButtons activity={row.original} refreshData={refreshData} />,
  },
]

function ActionButtons({ activity, refreshData }: { activity: Activity; refreshData: () => void }) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editedActivity, setEditedActivity] = useState(activity)

  const updateData = async () => {
    try {
      const { activity_id, ...updatedFields } = editedActivity;
      const response = await fetch('/api/activities', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activity_id, ...updatedFields }),
      });
      if (!response.ok) throw new Error('Failed to update activity');
      setIsEditOpen(false);
      refreshData();
    } catch (error) {
      console.error('Error updating activity:', error);
    }
  };

  const deleteData = async () => {
    try {
      const response = await fetch('/api/activities', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activity_id: activity.activity_id }),
      })
      if (!response.ok) throw new Error('Failed to delete activity')
      setIsDeleteOpen(false)
      refreshData()
    } catch (error) {
      console.error('Error deleting activity:', error)
    }
  }

  return (
    <div className="flex gap-2">
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Editar
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar actividad</DialogTitle>
            <DialogDescription>
              Modifique los campos que desee actualizar.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid items-center gap-4">
              <Label htmlFor="title">
                Título
              </Label>
              <Input
                id="title"
                value={editedActivity.title}
                onChange={(e) => setEditedActivity({ ...editedActivity, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid items-center gap-4">
              <Label htmlFor="description">
                Descripción
              </Label>
              <Textarea
                id="description"
                value={editedActivity.description}
                onChange={(e) => setEditedActivity({ ...editedActivity, description: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid items-center gap-4">
              <Label htmlFor="activity_type">
                Tipo
              </Label>
              <Select
                onValueChange={(value) => setEditedActivity({ ...editedActivity, activity_type: value })}
                defaultValue={editedActivity.activity_type}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccione un tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reunion">Reunión</SelectItem>
                  <SelectItem value="evento">Evento</SelectItem>
                  <SelectItem value="taller">Taller</SelectItem>
                  <SelectItem value="seminario">Seminario</SelectItem>
                  <SelectItem value="curso">Curso</SelectItem>
                  <SelectItem value="recreativa">Recreativa</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid items-center gap-4">
              <Label htmlFor="location">
                Ubicación
              </Label>
              <Input
                id="location"
                value={editedActivity.location}
                onChange={(e) => setEditedActivity({ ...editedActivity, location: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid items-center gap-4">
              <Label htmlFor="status">
                Estado
              </Label>
              <Select
                onValueChange={(value) => setEditedActivity({ ...editedActivity, status: value })}
                defaultValue={editedActivity.status}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccione un estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="finalizado">Finalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={updateData}>Guardar cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Eliminar
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. ¿Está seguro de que desea eliminar esta actividad?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={deleteData}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}