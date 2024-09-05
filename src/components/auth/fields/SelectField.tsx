import { FormControl, FormField, FormItem } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface Options {
  value: string
  label: string
}

interface SelectFieldProps {
  control: any
  name: string
  errors: any
  options: Options[]
  placeholder?: string
}

export function SelectField({
  control,
  name,
  options,
  placeholder,
  errors,
}: SelectFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full h-auto">
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger
                className={cn(
                  'text-lg px-4 h-auto text-muted-foreground hover:bg-transparent hover:text-slate-700',
                  errors &&
                    'text-destructive border-destructive hover:text-destructive'
                )}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                {field.value !== '' && <SelectLabel>{placeholder}</SelectLabel>}
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  )
}
