import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface InputFieldProps {
  type?: string
  control: any
  name: string
  errors: any
  maxLength?: number
  className?: string
  placeholder?: string
}

export function InputField({
  type = 'text',
  control,
  name,
  errors,
  maxLength,
  className,
  placeholder,
}: InputFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormControl>
            <Input
              {...field}
              type={type}
              maxLength={maxLength}
              className={cn(
                'h-auto text-lg px-4 focus:border-input focus:placeholder:text-muted-foreground',
                errors && 'border-destructive placeholder:text-destructive',
                className
              )}
              placeholder={placeholder}
            />
          </FormControl>
          {/* <FormMessage /> */}
        </FormItem>
      )}
    />
  )
}
