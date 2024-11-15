'use client'

import { useEffect, useState, useCallback } from "react"
import { type Request, createColumns as createRequestColumns } from "./tables/requests/columns"
import { RequestsTable } from "./tables/requests/data-table"
import { type Activity, createColumns as createActivityColumns } from "./tables/activities/columns"
import { ActivityTable } from "./tables/activities/data-table"
import { type ActUser, createColumns as createActUserColumns } from "./tables/act-user/columns"
import { ActUserTable } from "./tables/act-user/data-table"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ActivityForm } from "./forms/ActivityForm"

interface DashboardProps {
  role: string
}

export function Dashboard({ role }: DashboardProps) {
  const [requestData, setRequestsData] = useState<Request[]>([])
  const [activityData, setActivitiesData] = useState<Activity[]>([])
  const [actUserData, setActUserData] = useState<ActUser[]>([])

  const fetchData = useCallback(async () => {
    if (role === 'admin') {
      const requestsResponse = await fetch('/api/requests')
      const activitiesResponse = await fetch('/api/activities')

      const requestsData = await requestsResponse.json()
      const activitiesData = await activitiesResponse.json()

      setRequestsData(requestsData)
      setActivitiesData(activitiesData)
    } else {
      const actUserResponse = await fetch('/api/activities')
      const actUserData = await actUserResponse.json()
      setActUserData(actUserData)

      const partnerResponse = await fetch('/api/partner')
      const [partnerData] = await partnerResponse.json()
      setRequestsData(partnerData)
    }
  }, [role])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const onDataChange = (newActivity: Activity) => {
    setActivitiesData((prevActivities) => [...prevActivities, newActivity])
  }

  const refreshData = useCallback(() => {
    fetchData()
  }, [fetchData])

  const requestColumns = createRequestColumns(refreshData)
  const activitiesColumns = createActivityColumns(refreshData)
  const actUserColumns = createActUserColumns(refreshData)

  return (
    <div className="mt-10 px-6 pb-10">
      {role === 'admin' ? (
        <Card>
          <CardHeader className="px-7">
            <CardTitle>Panel de Control</CardTitle>
            <CardDescription>Solicitudes recientes de socios.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="requests" className="w-full">
              <TabsList>
                <TabsTrigger value="requests">Solicitudes</TabsTrigger>
                <TabsTrigger value="activities">Actividades</TabsTrigger>
              </TabsList>
              <TabsContent value="requests">
                <RequestsTable columns={requestColumns} data={requestData} onDataChange={setRequestsData} />
              </TabsContent>
              <TabsContent value="activities">
                <div className="px-3 border rounded-md">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1" className="border-none">
                      <AccordionTrigger className="hover:no-underline text-sm py-3 text-left">Despliega para agregar una nueva actividad</AccordionTrigger>
                      <AccordionContent>
                        <ActivityForm onDataChange={onDataChange} />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
                <ActivityTable columns={activitiesColumns} data={activityData} onDataChange={setActivitiesData} />
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
            <ActUserTable columns={actUserColumns} data={actUserData} onDataChange={setActUserData} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}