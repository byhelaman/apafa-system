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
      <div className="space-y-2">
        <h3 className="font-medium text-lg mb-4">Estudiante {index + 1}</h3>
        <SelectField
          control={control}
          name={`children_data.${index}.relationship_type`}
          options={[
            { value: 'apoderado', label: 'Apoderado' },
            { value: 'padre', label: 'Padre' },
            { value: 'madre', label: 'Madre' },
            { value: 'tutor', label: 'Tutor' },
          ]}
          placeholder="Relación con el estudiante"
        />
        <div className="flex flex-col sm:flex-row gap-2">
          <InputField
            control={control}
            name={`children_data.${index}.first_names`}
            placeholder="Nombres"
          />
          <InputField
            control={control}
            name={`children_data.${index}.last_names`}
            placeholder="Apellidos"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <InputField
            control={control}
            name={`children_data.${index}.dni`}
            maxLength={8}
            placeholder="DNI"
          />
          <DateField
            control={control}
            name={`children_data.${index}.date_of_birth`}
            placeholder="Fecha de nac."
          />
        </div>
        <InputField
          control={control}
          name={`children_data.${index}.school_grade`}
          placeholder="Grado y Sección"
        />
      </div>
    </>
  )
}
