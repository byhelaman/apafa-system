'use client'

import { useEffect, useState, useCallback } from "react"

import { type Partner, createColumns as createPartnerColumns } from "./tables/partners/columns"
import { PartnerTable } from "./tables/partners/data-table"

import { type Children, createColumns as createChildrenColumns } from "./tables/children/columns"
import { ChildrenTable } from "./tables/children/data-table"

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

export function Panel({ role }: DashboardProps) {
  const [partnerData, setPartnerData] = useState<Partner[]>([])
  const [childrenData, setChildrenData] = useState<Children[]>([])

  const fetchData = useCallback(async () => {
    if (role === 'admin') {
      const partnersResponse = await fetch('/api/partners')
      const childrenResponse = await fetch('/api/children')

      console.log(childrenResponse);


      const c_data = await childrenResponse.json();
      const p_data = await partnersResponse.json();

      setChildrenData(c_data);
      setPartnerData(p_data);
    }

  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refreshData = useCallback(() => {
    fetchData()
  }, [fetchData])

  const partnerColumns = createPartnerColumns(refreshData);
  const childrenColumns = createChildrenColumns(refreshData);

  return (
    <div className="mt-10 px-6">
      {role === 'admin' ? (
        <Card>
          <CardHeader className="px-7">
            <CardTitle>Asociados</CardTitle>
            <CardDescription>Solicitudes recientes de socios.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="requests" className="w-full  ">
              <TabsList>
                <TabsTrigger value="requests">Padres</TabsTrigger>
                <TabsTrigger value="users">Estudiantes</TabsTrigger>
              </TabsList>
              <TabsContent value="requests">
                <PartnerTable columns={partnerColumns} data={partnerData} onDataChange={setPartnerData} />
              </TabsContent>
              <TabsContent value="users">
                <ChildrenTable columns={childrenColumns} data={childrenData} onDataChange={setChildrenData} />
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