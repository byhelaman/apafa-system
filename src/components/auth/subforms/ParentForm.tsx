import { DateField } from '../fields/DateField'
import { InputField } from '../fields/InputField'
import { SelectField } from '../fields/SelectField'
import { ChildForm } from './ChildForm'

import { useEffect } from 'react'
import { useFieldArray, useWatch } from 'react-hook-form'
import { cn } from '@/lib/utils'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'

interface ParentFormProps {
  control: any
  errors: any
}

export function ParentForm({ control, errors }: ParentFormProps) {
  const childrenCount = useWatch({ name: 'children', control: control })
  const { fields, remove, append } = useFieldArray({
    name: 'children_data',
    control: control,
  })

  useEffect(() => {
    const count = parseInt(childrenCount) || 0

    if (count > fields.length) {
      for (let i = fields.length; i < count; i++) {
        append({
          relationship_type: '',
          first_names: '',
          last_names: '',
          dni: '',
          date_of_birth: '',
          school_grade: '',
          health_info: '',
        })
      }
    } else if (count < fields.length) {
      for (let i = fields.length; i > count; i--) {
        remove(i - 1)
      }
    }
  }, [childrenCount, append, remove, fields.length])

  return (
    <>
      <div className="space-y-4">
        <div className="wrapper">
          <h3 className="font-medium text-lg mb-4">Información Personal:</h3>
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <InputField
                control={control}
                name="first_names"
                errors={errors.first_names}
                placeholder="Nombres"
              />
              <InputField
                control={control}
                name="last_names"
                errors={errors.last_names}
                placeholder="Apellidos"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <InputField
                control={control}
                name="dni"
                errors={errors.dni}
                maxLength={8}
                placeholder="DNI"
              />
              <DateField
                control={control}
                name="date_of_birth"
                errors={errors.date_of_birth}
                placeholder="Fecha de nac."
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <SelectField
                control={control}
                name="education_level"
                errors={errors.education_level}
                options={[
                  { value: 'primaria', label: 'Primaria Completa' },
                  { value: 'secundaria', label: 'Secundaria Completa' },
                  { value: 'superior', label: 'Superior Técnica' },
                  { value: 'universitaria', label: 'Universitaria' },
                ]}
                placeholder="Nivel de educación"
              />
              <SelectField
                control={control}
                name="marital_status"
                errors={errors.marital_status}
                options={[
                  { value: 'soltero', label: 'Soltero' },
                  { value: 'casado', label: 'Casado' },
                ]}
                placeholder="Estado civil"
              />
            </div>
            <InputField
              control={control}
              name="address"
              errors={errors.address}
              placeholder="Dirección"
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <InputField
                control={control}
                name="email"
                errors={errors.email}
                placeholder="Correo electrónico"
              />
              <InputField
                control={control}
                name="phone"
                errors={errors.phone}
                maxLength={9}
                placeholder="Celular"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <InputField
                control={control}
                name="occupation"
                errors={errors.occupation}
                placeholder="Ocupación"
              />
              <SelectField
                control={control}
                name="children"
                errors={errors.children}
                options={[
                  { value: '1', label: '1' },
                  { value: '2', label: '2' },
                  { value: '3', label: '3' },
                ]}
                placeholder="Estudiantes a cargo"
              />
            </div>
          </div>
          {childrenCount && (
            <div className="mt-6 space-y-6 py-6 px-4 border-[1px] rounded-md">
              <h3 className="font-medium text-lg mb-4">
                Información del Estudiante:
              </h3>
              {fields.map((_, index) => (
                <ChildForm
                  key={index}
                  control={control}
                  errors={errors}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="mt-6">
        <FormField
          control={control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  className={errors.terms && 'border-destructive'}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  <a href="/terms/apafa" className="underline">
                    Términos y Condiciones
                  </a>
                </FormLabel>
                <FormDescription>
                  Confirmo que he leído, comprendido y acepto los términos y
                  condiciones.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>
    </>
  )
}
