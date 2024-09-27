import { Badge } from '@/components/ui/badge'
import { DateField } from '../../fields/DateField'
import { InputField } from '../../fields/InputField'
import { SelectField } from '../../fields/SelectField'

interface ChildFormProps {
  control: any
  index: number
}

export function ChildForm({ control, index }: ChildFormProps) {
  return (
    <>
      <div className="space-y-3">
        <Badge>Estudiante {index + 1}</Badge>
        <SelectField
          control={control}
          name={`children_data.${index}.relationship_type`}
          label='Relación con el estudiante'
          placeholder='Seleccionar'
          options={[
            { value: 'apoderado', label: 'Apoderado' },
            { value: 'padre', label: 'Padre' },
            { value: 'madre', label: 'Madre' },
            { value: 'tutor', label: 'Tutor' },
          ]}
        />
        <div className="flex flex-col sm:flex-row gap-3">
          <InputField
            control={control}
            name={`children_data.${index}.names`}
            label="Nombres"
          />
          <InputField
            control={control}
            name={`children_data.${index}.last_names`}
            label="Apellidos"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <InputField
            control={control}
            name={`children_data.${index}.identity_card`}
            label="Identificación (DNI)"
            maxLength={8}
          />
          <DateField
            control={control}
            name={`children_data.${index}.dob`}
            label='Fecha de Nac.'
            placeholder='Seleccionar'
          />
        </div>
        <InputField
          control={control}
          name={`children_data.${index}.school_grade`}
          label="Grado y Sección"
          placeholder='Ej: 1ro A Secundaria'
        />
      </div>
    </>
  )
}
