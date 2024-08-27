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

import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { InputInvite } from "../InputInvite"
import { Google } from "./Providers"


// default styles
const ButtonStyle = "h-auto w-full text-lg"
const InputStyle = "h-auto text-lg px-4 focus:border-input focus:placeholder:text-muted-foreground"

const FormSchema = z.object({
  email: z.string().email({ message: "Campo obligatorio" }),
  password: z.string().min(8, { message: "Campo obligatorio" }),
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
      // history.replaceState(null, '', '/search');
      location.href = json.redirect;
    }

    toast({
      title: !json.redirect ? "Oh no! Algo ha salido mal." : '',
      description: json.message
    })
  }

  const errors = form.formState.errors;

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
                  <Input placeholder="Correo electrónico" {...field}
                    className={
                      cn(
                        InputStyle, errors.email && "border-destructive placeholder:text-destructive"
                      )
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="password" placeholder="Contraseña" {...field}
                    className={
                      cn(
                        InputStyle, errors.password && "border-destructive placeholder:text-destructive"
                      )
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" className={ButtonStyle}>Iniciar Sesión</Button>
        </form>
      </Form>
      {/* <Google /> */}
      <InputInvite />
    </>
  )
}