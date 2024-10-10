import { ParentForm } from './subforms/ParentForm'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'


const formSchema = z.object({
  identity_card: z
    .string()
    .length(8, { message: 'DNI debe contener 8 caracteres' }),
  names: z.string().min(1, { message: 'Campo requerido' }),
  last_names: z.string().min(1, { message: 'Campo requerido' }),
  dob: z.date({ message: 'Campo requerido' }),
  phone: z.string().length(9, {
    message: 'Número de teléfono debe contener 9 caracteres',
  }),
  email: z.string().email({ message: 'Correo electrónico inválido' }),
  address: z
    .string()
    .min(10, { message: 'Dirección debe tener al menos 10 caracteres' }),
  education_level: z.string().min(1, { message: 'Campo requerido' }),
  occupation: z.string().min(1, { message: 'Campo requerido' }),
  marital_status: z.string().min(1, { message: 'Campo requerido' }),
  children_data: z
    .array(
      z.object({
        relationship_type: z
          .string()
          .refine((value) => value !== '', { message: 'Campo requerido' }),
        names: z.string().min(1, { message: 'Campo requerido' }),
        last_names: z.string().min(1, { message: 'Campo requerido' }),
        identity_card: z
          .string()
          .min(8, { message: 'DNI debe contener 8 caracteres' }),
        dob: z.date({ message: 'Campo requerido' }),
        school_grade: z.string().min(1, { message: 'Campo requerido' }),
        health_info: z.string().max(200).optional(),
      })
    )
    .min(1, { message: 'Debe incluir al menos un hijo' }),
  children: z
    .string()
    .refine((value) => value !== '', { message: 'Campo requerido' }),
  terms: z.boolean().refine((value) => value === true, {
    message: 'Debe aceptar los términos',
  }),
})

export function RegisterForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identity_card: '',
      names: '',
      last_names: '',
      phone: '',
      email: '',
      address: '',
      education_level: '',
      occupation: '',
      marital_status: '',
      children_data: [],
      children: '',
      terms: false,
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const bodyData = {
      ...data,
      dob: data.dob.toISOString(),
      terms: data.terms.toString(),
      children_data: JSON.stringify(data.children_data),
    }

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(bodyData).toString(),
    })

    const json = await response.json()
    form.reset()

    toast({
      // title: !json.error ? 'Oh no! Algo ha salido mal.' : '',
      description: json.message,
    })
  }

  const {
    control,
    formState: { errors },
  } = form

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="w-full border-none shadow-none">
          <CardHeader className='space-y-2'>
            <CardTitle>Registro en línea</CardTitle>
            <CardDescription>Para los nuevos miembros de la APAFA</CardDescription>
          </CardHeader>
          <CardContent>
            <span className='block py-6 border-t font-medium'>
              Información Personal
            </span>
            <ParentForm control={control} />
          </CardContent>
          <CardFooter>
            <div className="w-full">
              <div className="flex items-center text-sm justify-center">
                <Button className="w-full h-auto">
                  Enviar
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
