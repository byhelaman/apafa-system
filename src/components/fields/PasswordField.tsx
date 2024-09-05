import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

interface PasswordFieldProps {
  type?: string
  control: any
  name: string
  errors: any
  maxLength?: number
  className?: string
  placeholder?: string
}

export function PasswordField({
  control,
  name,
  errors,
  maxLength,
  className,
  placeholder,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false)

  const handleClick = () => {
    setShowPassword(!showPassword)
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormControl>
            <div className="relative flex items-center">
              <Input
                {...field}
                type={showPassword ? 'text' : 'password'}
                maxLength={maxLength}
                className={cn(
                  'h-auto text-lg px-4 focus:border-input focus:placeholder:text-muted-foreground',
                  errors && 'border-destructive placeholder:text-destructive',
                  className
                )}
                placeholder={placeholder}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-[5px]"
                onClick={handleClick}
              >
                <span className="sr-only">
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </span>
                {showPassword ? (
                  <EyeOff className="text-slate-500 h-5 w-5" />
                ) : (
                  <Eye className="text-slate-500 h-5 w-5" />
                )}
              </Button>
            </div>
          </FormControl>
          {/* <FormMessage /> */}
        </FormItem>
      )}
    />
  )
}
