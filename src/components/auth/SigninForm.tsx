// "use client"

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { cn } from '@/lib/utils'

import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { InputInvite } from '../InputInvite'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { InputField } from './Components/InputField'

// default styles
const ButtonStyle = 'h-auto w-full text-lg'

const FormSchema = z.object({
  email: z.string().email({ message: 'Campo obligatorio' }),
  password: z.string().min(8, { message: 'Campo obligatorio' }),
})

export function SigninForm() {
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true)

    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(data).toString(),
    })

    const json = await response.json()

    // redirect to SEARCH page
    if (json.redirect) {
      // history.replaceState(null, '', '/search');
      location.href = json.redirect
      // setLoading(false);
    }

    toast({
      title: !json.redirect ? 'Oh no! Algo ha salido mal.' : '',
      description: json.message,
    })
  }

  const {
    control,
    formState: { errors },
  } = form

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <InputField
              control={control}
              name="email"
              errors={errors.email}
              placeholder="Correo electrónico"
            />
            <InputField
              control={control}
              name="password"
              errors={errors.password}
              placeholder="Contraseña"
            />
            <Button type="submit" className={ButtonStyle} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Iniciar Sesión
            </Button>
          </div>
        </form>
      </Form>
      {/* <Google /> */}
      <InputInvite />
    </>
  )
}
