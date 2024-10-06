import { useEffect, useState } from "react";

import { type Partner, columns } from "./payments/columns"
import { DataTable } from "./payments/data-table"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface DashboardProps {
  role: string
}

export function Dashboard({ role }: DashboardProps) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (role !== 'admin') {
        const response = await fetch('/api/partner')
        const [data] = await response.json();
        setData(data);
      }

      const response = await fetch('/api/requests')
      const data = await response.json();
      setData(data);
    }

    fetchData();
  }, []);

  return (
    <>
      <div className="mt-10 px-6">
        {role === 'admin' ? (
          <Card>
            <CardHeader className="px-7">
              <CardTitle>Solicitudes Pendientes</CardTitle>
              <CardDescription>Recent orders from your store.</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={data} />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="px-7">
              <CardTitle>Actividades</CardTitle>
              <CardDescription>Recent orders from your store.</CardDescription>
            </CardHeader>
            <CardContent>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
