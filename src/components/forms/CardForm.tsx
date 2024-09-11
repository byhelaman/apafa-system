import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Github } from '@/components/Icons'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { toast } from '@/components/ui/use-toast'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Eye,
  FileText,
  MessageCircleQuestion,
  User,
  UserPlus,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'

export function CardForm() {
  return (
    <Card className="w-full border-none shadow-none">
      <CardHeader>
        <CardTitle>APAFA145</CardTitle>
        <CardDescription>
          Bienvenido, ingresa tus credenciales para continuar con el acceso.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="partner" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="partner">Asociado</TabsTrigger>
            <TabsTrigger value="admin">Administrador</TabsTrigger>
          </TabsList>
          <TabsContent value="partner">
            <Tabs defaultValue="singin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-auto">
                <TabsTrigger value="singin">
                  <User className="w-4 h-4 mr-2" />
                  Iniciar Sesión
                </TabsTrigger>
                <TabsTrigger value="question">
                  <MessageCircleQuestion className="w-4 h-4 mr-2" />
                  Consultar
                </TabsTrigger>
              </TabsList>
              <TabsContent value="singin">
                <div className="mt-6">
                  <SigninForm />
                </div>
              </TabsContent>
              <TabsContent value="question">
                <div className="mt-6">
                  <span className="text-sm">form...</span>
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>
          <TabsContent value="admin">
            <div className="mt-6">
              <AdminForm />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <div className="w-full">
          <div className="flex h-5 items-center space-x-4 text-sm justify-center">
            <Button variant="link" className="h-auto py-0 px-2">
              Registrarse
            </Button>
            <Separator orientation="vertical" />
            <Button variant="link" className="h-auto py-0 px-2">
              Política de Uso
            </Button>
            <Separator orientation="vertical" />
            <Button variant="link" className="h-auto py-0 px-2">
              Github
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

const SigninSchema = z.object({
  code: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  dni: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
})

export function SigninForm() {
  const form = useForm<z.infer<typeof SigninSchema>>({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      code: '',
      dni: '',
    },
  })

  function onSubmit(data: z.infer<typeof SigninSchema>) {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-2 mb-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código de registro</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: 09123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dni"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Identificación (DNI)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full">
          Iniciar Sesión
        </Button>
      </form>
    </Form>
  )
}

const AdminSchema = z.object({
  email: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  password: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
})

export function AdminForm() {
  const form = useForm<z.infer<typeof AdminSchema>>({
    resolver: zodResolver(AdminSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  function onSubmit(data: z.infer<typeof AdminSchema>) {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-2 mb-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo electrónico</FormLabel>
                <FormControl>
                  <Input placeholder="correo@ejemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full">
          Iniciar Sesión
        </Button>
      </form>
    </Form>
  )
}
