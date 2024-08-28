// "use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { InputInvite } from "./InputInvite"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

// default styles
const ButtonStyle = "h-auto w-full text-lg"
const InputStyle = "h-auto text-6xl px-4 text-center focus:border-input focus:placeholder:text-muted-foreground"
// const InputStyle = "h-auto text-lg px-4 focus:border-input focus:placeholder:text-muted-foreground"

const FormSchema = z.object({
  dni: z.string().min(1, {
    message: "DNI requerido"
  }).regex(/^\d+$/, {
    message: "Solo se permiten números"
  }).length(8, {
    message: "DNI incompleto"
  })
})

export function SearchForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState({});

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dni: ""
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(data).toString(),
    });

    const json = await response.json();
    console.log(json);

    // show modal
    setIsModalOpen(true);
    setData(json);
  }

  const errors = form.formState.errors;

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="dni"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} maxLength={8}
                    className={
                      cn(
                        InputStyle, errors.dni && "border-destructive placeholder:text-destructive"
                      )
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            data={data}
          />
          <Button type="submit" className={ButtonStyle}>Buscar</Button>
        </form>
      </Form>
    </>
  )
}

const FormSchema2 = z.object({
  code: z.string().min(1, {
    message: "Código requerido"
  }).regex(/^\d+$/, {
    message: "Solo se permiten números"
  })
})

export function SearchForm2() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState({});

  const form = useForm<z.infer<typeof FormSchema2>>({
    resolver: zodResolver(FormSchema2),
    defaultValues: {
      code: ""
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema2>) {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(data).toString(),
    });

    const json = await response.json();
    console.log(json);

    // show modal
    setIsModalOpen(true);
    setData(json);
  }

  const errors = form.formState.errors;

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative flex items-center">
                    <span className={cn(`px-3 absolute left-[5px] text-lg text-slate-500`, errors.code && "text-destructive")}>CR -</span>
                    <Input {...field} maxLength={5}
                      className={
                        cn(
                          "h-auto text-lg px-14 focus:border-input focus:placeholder:text-muted-foreground", errors.code && "border-destructive placeholder:text-destructive"
                        )
                      }
                    />
                    <Button type="submit" size="sm" className="px-3 absolute right-[5px]" variant="outline">
                      <span className="sr-only">Search</span>
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            data={data}
          />
        </form>
      </Form>
    </>
  )
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    message?: string;
  }
}

function Modal({ isOpen, onClose, data = {} }: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">@code</DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Información de usuario
        </DialogDescription>
        <div className="">
          <div className="">
            <h4>@member</h4>
            <div className="flex gap-2">
              <Badge variant="secondary">@status</Badge>
              <Badge variant="secondary">@date</Badge>
            </div>
          </div>
          <div className="grid py-4">
            <span>{data.message}</span>
            <span>@phone</span>
            <span>@address</span>
          </div>
          <div className="">
            <div className="w-full flex justify-between items-center border rounded-md p-4">
              <div className="">
                <h4>@name</h4>
                <span>@dni</span>
              </div>
              <Badge variant="secondary">@grade</Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
