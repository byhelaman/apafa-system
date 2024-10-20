'use client'

import { useEffect, useState, useCallback } from "react"

import { type Request, createColumns as createRequestColumns } from "./tables/requests/columns"
import { RequestsTable } from "./tables/requests/data-table"

import { type User, createColumns as createUserColumns } from "./tables/users/columns"
import { UserTable } from "./tables/users/data-table"

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
  const [requestData, setRequestsData] = useState<Request[]>([])
  const [userData, setUsersData] = useState<User[]>([])

  const fetchData = useCallback(async () => {
    if (role === 'admin') {
      const requestsResponse = await fetch('/api/requests')
      const usersResponse = await fetch('/api/users')

      const requestsData = await requestsResponse.json();
      const usersData = await usersResponse.json();

      setRequestsData(requestsData);
      setUsersData(usersData);
    } else {
      const partnerResponse = await fetch('/api/partner')
      const [partnerData] = await partnerResponse.json()
      setRequestsData(partnerData)
    }

  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refreshData = useCallback(() => {
    fetchData()
  }, [fetchData])

  const requestColumns = createRequestColumns(refreshData);
  const userColumns = createUserColumns(refreshData);

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
                <RequestsTable columns={requestColumns} data={requestData} onDataChange={setRequestsData} />
              </TabsContent>
              <TabsContent value="events">
                @actividades
              </TabsContent>
              <TabsContent value="users">
                <UserTable columns={userColumns} data={userData} onDataChange={setUsersData} />
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