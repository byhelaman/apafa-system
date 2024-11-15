import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form } from '@/components/ui/form'
import { InputField } from '@/components/fields/InputField'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { SelectField } from '../fields/SelectField'

import { type Activity } from "../../components/tables/activities/columns"

interface ActivityFormProps {
  onDataChange: (newActivity: Activity) => void;
}

const ActivitySchema = z.object({
  title: z.string().min(1, { message: 'Campo requerido' }),
  description: z.string().min(1, { message: 'Campo requerido' }),
  activity_type: z.string().min(1, { message: 'Campo requerido' }),
  location: z.string().min(1, { message: 'Campo requerido' }),
})

export function ActivityForm({ onDataChange }: ActivityFormProps) {
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof ActivitySchema>>({
    resolver: zodResolver(ActivitySchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      activity_type: '',
    },
  })

  async function onSubmit(data: z.infer<typeof ActivitySchema>) {
    setLoading(true)

    try {
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(data).toString(),
      })

      if (!response.ok) {
        throw new Error('Failed to create activity')
      }


      const json = await response.json()

      if (json.redirect) {
        location.href = json.redirect
      }

      const newActivity: Activity = await response.json()
      onDataChange(newActivity)
      form.reset()
    } catch (error) {
      console.error('Error creating activity:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full border-none shadow-none">
      <CardHeader className='space-y-2'>
        <CardTitle>Crear Actividad</CardTitle>
        <CardDescription>
          Actividad para los usuarios de APAFA145.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mt-6">
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row gap-3">
                  <InputField
                    control={form.control}
                    name="title"
                    label="Título"
                  />
                  <InputField
                    control={form.control}
                    name="description"
                    label="Descripción"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <SelectField
                    control={form.control}
                    name="activity_type"
                    label='Tipo de Actividad'
                    placeholder='Seleccionar'
                    options={[
                      { value: 'reunion', label: 'Reunión' },
                      { value: 'evento', label: 'Evento' },
                      { value: 'actividad_deportiva', label: 'Deportiva' },
                      { value: 'otro', label: 'Otro' },
                    ]}
                  />
                  <InputField
                    control={form.control}
                    name="location"
                    label="Ubicación"
                  />
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full mt-6" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Crear Actividad
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}