import { ParentForm } from './Form/ParentForm'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Form } from '../ui/form'
import { Button } from '../ui/button'

const formSchema = z.object({
  dni: z
    .string()
    .length(8, { message: 'DNI debe tener exactamente 8 caracteres' }),
  first_names: z.string().min(1, { message: 'Campo requerido' }),
  last_names: z.string().min(1, { message: 'Campo requerido' }),
  date_of_birth: z.string().date(),
  phone: z.string().length(9, {
    message: 'Número de teléfono debe tener exactamente 9 caracteres',
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
        first_names: z.string().min(1, { message: 'Campo requerido' }),
        last_names: z.string().min(1, { message: 'Campo requerido' }),
        dni: z
          .string()
          .min(8, { message: 'DNI debe tener al menos 8 caracteres' }),
        date_of_birth: z.string().date(),
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
      dni: '',
      first_names: '',
      last_names: '',
      date_of_birth: '',
      phone: '',
      email: '',
      address: '',
      education_level: '',
      occupation: '',
      marital_status: '',
      children: '',
      children_data: [],
      terms: false,
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const bodyData = {
      ...data,
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
    console.log(json)
  }

  const {
    control,
    formState: { errors },
  } = form

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ParentForm control={control} errors={errors} />
        <Button type="submit" className="h-auto w-full text-lg mt-5">
          Enviar
        </Button>
      </form>
    </Form>
  )
}
