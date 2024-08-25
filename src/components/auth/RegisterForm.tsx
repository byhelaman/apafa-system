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
  FormMessage
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { es } from 'date-fns/locale'
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

// Default styles
const InputStyle = "h-auto text-lg px-4 focus:border-input focus:placeholder:text-muted-foreground"
const ButtonStyle = "h-auto w-full text-lg mt-5"

const ChildSchema = z.object({
  child_first_names: z.string().min(1, { message: "Campo requerido" }),
  child_last_names: z.string().min(1, { message: "Campo requerido" }),
  child_dni: z.string().min(8, { message: "Campo requerido" }).max(8, { message: "DNI debe tener 8 caracteres" }),
  grade: z.string().min(1, { message: "Campo requerido" }),
  relationship: z.string().min(1, { message: "Campo requerido" }),
});

const FormSchema = z.object({
  first_names: z.string().min(1, { message: "Campo requerido" }),
  last_names: z.string().min(1, { message: "Campo requerido" }),
  dni: z.string().min(8, { message: "Campo requerido" }).max(8),
  phone: z.string().min(9, { message: "Campo requerido" }).max(9),
  address: z.string().min(10, { message: "Campo requerido" }),
  birth: z.date({ message: "Campo requerido" }),
  children: z.string().refine(value => value !== "", { message: "Campo requerido" }),
  children_data: z.array(ChildSchema).nonempty({ message: "Campo requerido" }),
  terms: z.boolean().refine(value => value === true, { message: "Campo requerido" }),
})

export function RegisterForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      first_names: "",
      last_names: "",
      dni: "",
      phone: "",
      address: "",
      children: "",
      terms: false,
    }
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const bodyData = {
      ...data,
      terms: data.terms.toString(),
      birth: format(data.birth, "yyyy-MM-dd").toString(),
    };

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(JSON.stringify(bodyData)).toString(),
    });

    const json = await response.json();
    console.log(json);

    toast({
      title: "method POST",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(json, null, 2)}</code>
        </pre>
      ),
    })
  }

  const errors = form.formState.errors;

  return (
    <Form {...form}>
      <div>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <h3 className="font-medium text-lg mb-4">Información Personal</h3>
            <div className="flex flex-col sm:flex-row gap-2">
              <FormField
                control={form.control}
                name="first_names"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input {...field} className={cn(InputStyle, errors.first_names && "border-destructive placeholder:text-destructive")} placeholder="Nombres" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_names"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input {...field} className={cn(InputStyle, errors.last_names && "border-destructive placeholder:text-destructive")} placeholder="Apellidos" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <FormField
                control={form.control}
                name="dni"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input {...field} maxLength={8} className={cn(InputStyle, errors.dni && "border-destructive placeholder:text-destructive")} placeholder="DNI" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <div className="relative flex items-center">
                        <span className={cn(`px-3 absolute left-[4px] text-lg text-slate-500`, errors.phone && "text-destructive")}>+51</span>
                        <Input {...field} maxLength={9} className={cn(`${InputStyle} pl-14`, errors.phone && "border-destructive placeholder:text-destructive")} />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input {...field} className={cn(InputStyle, errors.address && "border-destructive placeholder:text-destructive")} placeholder="Dirección" />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <FormField
                control={form.control}
                name="birth"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-4 text-left font-normal text-lg h-auto text-muted-foreground hover:bg-transparent",
                              errors.birth && "hover:text-destructive text-destructive border-destructive"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "P", { locale: es })
                            ) : (
                              <span>Fecha de Nac.</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                          captionLayout="dropdown-buttons"
                          fromYear={1900}
                          toYear={new Date().getFullYear()}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="children"
                render={({ field }) => (
                  <FormItem className="w-full h-auto">
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className={cn("text-lg px-4 h-auto text-muted-foreground hover:bg-transparent hover:text-slate-700", errors.children && "text-destructive border-destructive hover:text-destructive")}>
                          <SelectValue placeholder="Cuantos hijos tiene?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* student information */}
          <div className="mt-6 space-y-6">
            {
              Array.from({ length: parseInt(form.watch("children")) }, (_, index) => (
                <div key={index}>
                  <h3 className="font-medium text-lg mb-4">Hijo/a {index + 1}</h3>
                  <ChildrenForm key={index} control={form.control} errors={errors} />
                </div>
              ))
            }
          </div>

          {/* student information */}

          <div className="mt-6">
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox className={errors.terms && "border-destructive"}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      <a href="/terms/apafa" className="underline">Términos y Condiciones</a>
                    </FormLabel>
                    <FormDescription>
                      Confirmo que he leído, comprendido y acepto los términos y condiciones.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className={ButtonStyle}>Enviar</Button>
        </form>
      </div>
    </Form>
  )
}

interface ChildrenFormProps {
  control: any;
  errors: any;
}

function ChildrenForm({ control, errors }: ChildrenFormProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row gap-2">
        <FormField
          control={control}
          name="first_names"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input {...field} className={cn(InputStyle, errors.child_first_names && "border-destructive placeholder:text-destructive")} placeholder="Nombres" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="last_names"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input {...field} className={cn(InputStyle, errors.child_last_names && "border-destructive placeholder:text-destructive")} placeholder="Apellidos" />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <FormField
          control={control}
          name="dni"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input {...field} maxLength={8} className={cn(InputStyle, errors.child_dni && "border-destructive placeholder:text-destructive")} placeholder="DNI" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="grade"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input {...field} maxLength={2} className={cn(`${InputStyle} uppercase placeholder:normal-case`, errors.grade && "border-destructive placeholder:text-destructive")} placeholder="Grado" />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <FormField
          control={control}
          name="relationship"
          render={({ field }) => (
            <FormItem className="w-full h-auto">
              <Select onValueChange={field.onChange} defaultValue={"apoderado"}>
                <FormControl>
                  <SelectTrigger className={cn("text-lg px-4 h-auto text-muted-foreground hover:bg-transparent hover:text-slate-700", errors.relationship && "text-destructive border-destructive hover:text-destructive")}>
                    <SelectValue placeholder="Apoderado" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="apoderado">Apoderado</SelectItem>
                    <SelectItem value="padre">Padre</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}