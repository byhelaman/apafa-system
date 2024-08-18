// "use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

import { InputInvite } from "../InputInvite"


// default styles
const InputStyle = "h-auto text-lg px-4"
const ButtonStyle = "h-auto w-full text-lg"

const FormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

export function SigninForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {

    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(data).toString(),
    });

    const json = await response.json();

    // redirect to SEARCH page
    if (json.redirect) {
      history.replaceState(null, '', '/search');
      location.href = json.redirect;
    }

    toast({
      title: !json.redirect ? "Oh no! Algo ha salido mal." : '',
      description: json.message
    })
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Correo electrónico" {...field} className={InputStyle} autoFocus />
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
                <FormControl>
                  <Input type="password" placeholder="Contraseña" {...field} className={InputStyle} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className={ButtonStyle}>Iniciar Sesión</Button>
        </form>
      </Form>
      <InputInvite text="Regístrate con este enlace:" />
    </>
  )
}