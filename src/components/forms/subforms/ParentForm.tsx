import { DateField } from '@/components/fields/DateField'
import { InputField } from '@/components/fields/InputField'
import { SelectField } from '@/components/fields/SelectField'
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
}

export function ParentForm({ control }: ParentFormProps) {
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
          names: '',
          last_names: '',
          identity_card: '',
          dob: '',
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
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <InputField
                control={control}
                name="names"
                label="Nombres"
              />
              <InputField
                control={control}
                name="last_names"
                label="Apellidos"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <InputField
                control={control}
                name="identity_card"
                label="Identificación (DNI)"
                maxLength={8}
              />
              <DateField
                control={control}
                name="dob"
                label='Fecha de Nac.'
                placeholder='Seleccionar'
              />
            </div>
            <InputField
              control={control}
              name="address"
              label="Dirección"
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <SelectField
                control={control}
                name="education_level"
                label='Nivel de educación'
                placeholder='Seleccionar'
                options={[
                  { value: 'primaria', label: 'Primaria Completa' },
                  { value: 'secundaria', label: 'Secundaria Completa' },
                  { value: 'superior', label: 'Superior Técnica' },
                  { value: 'universitaria', label: 'Universitaria' },
                ]}
              />
              <SelectField
                control={control}
                name="marital_status"
                label='Estado civil'
                placeholder='Seleccionar'
                options={[
                  { value: 'soltero', label: 'Soltero' },
                  { value: 'live-in-partner', label: 'Conviviente' },
                  { value: 'casado', label: 'Casado' },
                ]}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <InputField
                control={control}
                name="email"
                label="Correo electrónico"
              />
              <InputField
                control={control}
                name="phone"
                label="Celular"
                maxLength={9}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <InputField
                control={control}
                name="occupation"
                label="Profesión u Oficio"
              />
              <SelectField
                control={control}
                name="children"
                label='Estudiantes a cargo'
                placeholder='Seleccionar'
                options={[
                  { value: '1', label: '1' },
                  { value: '2', label: '2' },
                  { value: '3', label: '3' },
                ]}
              />
            </div>
          </div>
          {childrenCount && (
            <div className="mt-6 space-y-6 pt-6 border-t">
              <span className='block font-medium'>
                Información del Estudiante
              </span>
              {fields.map((_, index) => (
                <div className="border pb-6 p-4 rounded-lg">
                  <ChildForm key={index} control={control} index={index} />
                </div>
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
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Terminos y Condiciones
                </FormLabel>
                <FormDescription>
                  You can manage your
                  <a href="/examples/forms"> mobile settings</a> page.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>
    </>
  )
}
