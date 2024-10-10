'use client'

import { useEffect, useState, useCallback } from "react"

import { type Partner, createColumns } from "./payments/columns"
import { DataTable } from "./payments/data-table"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DashboardProps {
  role: string
}

export function Dashboard({ role }: DashboardProps) {
  const [data, setData] = useState<Partner[]>([])

  const fetchData = useCallback(async () => {
    if (role === 'admin') {
      const response = await fetch('/api/requests')
      const data = await response.json()
      setData(data)
    } else {
      const response = await fetch('/api/partner')
      const [data] = await response.json()
      setData(data)
    }
  }, [role])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refreshData = useCallback(() => {
    fetchData()
  }, [fetchData])

  const columns = createColumns(refreshData)

  return (
    <div className="mt-10 px-6">
      {role === 'admin' ? (
        <Card>
          <CardHeader className="px-7">
            <CardTitle>Panel de Control</CardTitle>
            <CardDescription>Solicitudes recientes de socios.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="requests" className="w-full  ">
              <TabsList>
                <TabsTrigger value="requests">Solicitudes</TabsTrigger>
                <TabsTrigger value="events">Actividades</TabsTrigger>
                <TabsTrigger value="users">Usuarios</TabsTrigger>
              </TabsList>
              <TabsContent value="requests">
                <DataTable columns={columns} data={data} onDataChange={setData} />
              </TabsContent>
              <TabsContent value="events">
                @actividades
              </TabsContent>
              <TabsContent value="users">
                @users
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="px-7">
            <CardTitle>Actividades</CardTitle>
            <CardDescription>Tus actividades recientes.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Add content for non-admin users here */}
          </CardContent>
        </Card>
      )}
    </div>
  )
}