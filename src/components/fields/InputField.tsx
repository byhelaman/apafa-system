import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

interface InputFieldProps {
  type?: string
  control: any
  name: string
  label?: string
  maxLength?: number
  className?: string
  placeholder?: string
}

export function InputField({
  type,
  control,
  name,
  label,
  maxLength,
  className,
  placeholder,
}: InputFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              type={type}
              maxLength={maxLength}
              className={className}
              placeholder={placeholder}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
