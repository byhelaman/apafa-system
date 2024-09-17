import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { toast } from '@/components/ui/use-toast'
import { Form } from '@/components/ui/form'

import { Separator } from '@/components/ui/separator'
import { InputField } from '../fields/InputField'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

const PartnerSchema = z.object({
  code: z
    .string()
    .min(1, { message: 'El código de registro es obligatorio.' })
    .max(9, {
      message: 'El código de registro debe contener hasta 6 caracteres.',
    }),

  dni: z.string().length(8, { message: 'El DNI debe contener 8 caracteres.' }),
})

const AdminSchema = z.object({
  email: z.string().email({ message: 'El correo electrónico no es válido.' }),
  password: z.string().min(1, { message: 'La contraseña es obligatoria.' }),
})

export function CardForm() {
  const [loading, setLoading] = useState(false)

  const [tabValue, setTabValue] = useState('partner')
  const formSchema = tabValue === 'partner' ? PartnerSchema : AdminSchema

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
      dni: '',
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setLoading(true)

    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(data).toString(),
    })

    const json = await response.json()

    // redirect to DASHBOARD page
    if (json.redirect) {
      // history.replaceState(null, '', '/dashboard');
      location.href = json.redirect
      // setLoading(false);
    }

    toast({
      title: json.message,
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Card className="w-full border-none shadow-none">
      <CardHeader>
        <CardTitle>APAFA145</CardTitle>
        <CardDescription>
          Bienvenido, ingresa tus credenciales para continuar con el acceso.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="partner"
          className="w-full"
          onValueChange={(value) => setTabValue(value)}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="partner">Asociado</TabsTrigger>
            <TabsTrigger value="admin">Administrador</TabsTrigger>
          </TabsList>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <TabsContent value="partner">
                <div className="mt-6">
                  <PartnerForm control={form.control} />
                </div>
              </TabsContent>
              <TabsContent value="admin">
                <div className="mt-6">
                  <AdminForm control={form.control} />
                </div>
              </TabsContent>
              <Button type="submit" className="w-full mt-6" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Iniciar Sesión
              </Button>
            </form>
          </Form>
          {
            tabValue === 'partner' && <span className='block my-6 text-sm text-center'>
              No tiene una cuenta? <a href="/register" className='font-medium underline'>Regístrese</a>
            </span>
          }
        </Tabs>
      </CardContent>
      <CardFooter className={`flex flex-col gap-2 ${tabValue === 'admin' ? 'mt-[116px]' : 'mt-12'}`}>
        <div className="w-full">
          <div className="flex items-center text-sm justify-center">
            <Button variant="link" className="h-auto px-0">
              Condiciones de uso
            </Button>
            <Separator orientation="vertical" className="h-5 mx-2 sm:mx-3" />
            <Button variant="link" className="h-auto px-0">
              Política de privacidad
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

export function PartnerForm({ control }: any) {
  return (
    <div className="space-y-2">
      <InputField
        control={control}
        name="code"
        label="Código de registro"
        maxLength={8}
        placeholder="Ej: CRAF0478"
      />
      <InputField
        control={control}
        name="dni"
        label="Identificación (DNI)"
        maxLength={8}
      />
    </div>
  )
}

export function AdminForm({ control }: any) {
  return (
    <div className="space-y-2">
      <InputField
        control={control}
        name="email"
        label="Correo electrónico"
      />
      <InputField
        type="password"
        control={control}
        name="password"
        label="Contraseña"
      />
    </div>
  )
}
