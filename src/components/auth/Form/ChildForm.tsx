import { DateField } from '../Components/DateField'
import { InputField } from '../Components/InputField'
import { SelectField } from '../Components/SelectField'

interface ChildFormProps {
  control: any
  errors: any
  index: number
}

export function ChildForm({ control, errors, index }: ChildFormProps) {
  const { children_data } = errors

  return (
    <>
      <div className="space-y-2">
        <h3 className="font-medium text-lg mb-4">Estudiante {index + 1}</h3>
        <SelectField
          control={control}
          name={`children_data.${index}.relationship_type`}
          errors={children_data?.[index]?.relationship_type}
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
            errors={children_data?.[index]?.first_names}
            placeholder="Nombres"
          />
          <InputField
            control={control}
            name={`children_data.${index}.last_names`}
            errors={children_data?.[index]?.last_names}
            placeholder="Apellidos"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <InputField
            control={control}
            name={`children_data.${index}.dni`}
            errors={children_data?.[index]?.dni}
            maxLength={8}
            placeholder="DNI"
          />
          <DateField
            control={control}
            name={`children_data.${index}.date_of_birth`}
            errors={children_data?.[index]?.date_of_birth}
            placeholder="Fecha de nac."
          />
        </div>
        <InputField
          control={control}
          name={`children_data.${index}.school_grade`}
          errors={children_data?.[index]?.school_grade}
          placeholder="Grado y Sección"
        />
      </div>
    </>
  )
}
