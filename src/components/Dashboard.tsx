import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "./ui/button";

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
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {data.map((item, index) => (
                <Card className="w-full" key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{format(item.enrollment_date, 'P', { locale: es })}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold truncate">{`${item.names} ${item.last_names}`}</div>
                    <p className="text-xs text-muted-foreground">DNI{item.identity_card}</p>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm" variant="outline" className="w-full">Detalles</Button>
                  </CardFooter>
                </Card>
              ))}
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
