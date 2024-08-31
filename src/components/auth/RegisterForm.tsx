import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { useEffect } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

// Define the styles for the button and input
const ButtonStyle = "h-auto w-full text-lg mt-5";
const InputStyle = "h-auto text-lg px-4 focus:border-input focus:placeholder:text-muted-foreground";

// Define the schema for child data
const childSchema = z.object({
  first_names: z.string().min(1, { message: "Campo requerido" }),
  last_names: z.string().min(1, { message: "Campo requerido" }),
  dni: z.string().min(8, { message: "Campo requerido" }).max(8, { message: "DNI debe tener 8 caracteres" }),
  grade: z.string().min(1, { message: "Campo requerido" }),
  relationship: z.string().min(1, { message: "Campo requerido" }),
});

const formSchema = z.object({
  first_names: z.string().min(1, { message: "Campo requerido" }),
  last_names: z.string().min(1, { message: "Campo requerido" }),
  dni: z.string().min(8, { message: "Campo requerido" }).max(8),
  phone: z.string().min(9, { message: "Campo requerido" }).max(9),
  address: z.string().min(10, { message: "Campo requerido" }),
  birth: z.date({ message: "Campo requerido" }),
  children: z.string().refine(value => value !== "", { message: "Campo requerido" }),
  children_data: z.array(childSchema).nonempty({ message: "Campo requerido" }),
  terms: z.boolean().refine(value => value === true, { message: "Campo requerido" }),
});

export function RegisterForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_names: '',
      last_names: '',
      dni: '',
      phone: '',
      address: '',
      children: '',
      children_data: [],
      terms: false,
    },
  });

  const { fields, remove, append } = useFieldArray({
    control: form.control,
    name: "children_data",
  });

  // Watch the value of the children field
  const childrenCount = useWatch({ name: "children", control: form.control });

  useEffect(() => {
    const count = parseInt(childrenCount) || 0;

    if (count > fields.length) {
      // Add new fields if needed
      for (let i = fields.length; i < count; i++) {
        append({ first_names: '', last_names: '', dni: '', grade: '', relationship: '' });
      }
    } else if (count < fields.length) {
      // Remove excess fields
      for (let i = fields.length; i > count; i--) {
        remove(i - 1);
      }
    }
  }, [childrenCount, append, remove, fields.length]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const bodyData = {
      ...data,
      terms: data.terms.toString(),
      birth: format(data.birth, "yyyy-MM-dd").toString(),
      children_data: JSON.stringify(data.children_data)
    };

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(bodyData).toString(),
    });

    const json = await response.json();
    console.log(json);

  }

  const errors = form.formState.errors;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} >
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
                        toYear={new Date().getFullYear() - 16}
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
                      <SelectTrigger
                        className={cn(
                          "text-lg px-4 h-auto text-muted-foreground hover:bg-transparent hover:text-slate-700",
                          errors.children && "text-destructive border-destructive hover:text-destructive"
                        )}
                      >
                        <SelectValue placeholder="Estudiantes a cargo?" />
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
        {
          childrenCount &&
          <div className="mt-6 space-y-6 py-6 px-4 border-[1px] rounded-md">
            <h3 className="font-medium text-lg mb-4">Información del Estudiante</h3>
            {fields.map((field, index) => (
              <ChildForm
                key={index}
                index={index}
                field={field}
                form={form}
                errors={errors.children_data}
              />
            ))}
          </div>
        }
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
        <Button type="submit" className={ButtonStyle}>
          Enviar
        </Button>
      </form>
    </Form>
  );
}

interface ChildFormProps {
  index: number;
  field: any;
  form: any;
  errors: any;
}

// Component for rendering individual child form fields
function ChildForm({ index, field, form, errors, }: ChildFormProps) {
  return (
    <div>
      <h3 className="font-medium text-lg mb-4">Hijo/a {index + 1}</h3>
      <div className="space-y-2">
        <FormField
          control={form.control}
          name={`children_data.${index}.relationship`}
          render={({ field }) => (
            <FormItem className="w-full h-auto">
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger
                    className={cn(
                      "text-lg px-4 h-auto text-muted-foreground hover:bg-transparent hover:text-slate-700",
                      errors?.[index]?.relationship && "text-destructive border-destructive hover:text-destructive"
                    )}
                  >
                    <SelectValue placeholder="Relación con el estudiante?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="apoderado">soy Apoderado</SelectItem>
                    <SelectItem value="padre">soy Padre</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <div className="flex flex-col sm:flex-row gap-2">
          <FormField
            control={form.control}
            name={`children_data.${index}.first_names`}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    {...field}
                    className={
                      cn(
                        InputStyle, errors?.[index]?.first_names && "border-destructive placeholder:text-destructive"
                      )
                    }
                    placeholder="Nombres"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`children_data.${index}.last_names`}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    {...field}
                    className={
                      cn(
                        InputStyle, errors?.[index]?.last_names && "border-destructive placeholder:text-destructive"
                      )
                    }
                    placeholder="Apellidos"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <FormField
            control={form.control}
            name={`children_data.${index}.dni`}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    {...field} maxLength={8}
                    className={
                      cn(
                        InputStyle, errors?.[index]?.dni && "border-destructive placeholder:text-destructive"
                      )
                    }
                    placeholder="DNI"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`children_data.${index}.grade`}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    {...field}
                    className={
                      cn(
                        InputStyle, errors?.[index]?.grade && "border-destructive placeholder:text-destructive"
                      )
                    }
                    placeholder="Grado y sección"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
