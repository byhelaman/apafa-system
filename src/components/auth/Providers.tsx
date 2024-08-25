import { Button } from "@/components/ui/button"
import { GoogleIcon } from "../Icons"

export function Google() {
  return (
    <div className="mt-4">
      <span className="relative flex justify-center items-center w-full before:w-full before:h-[1px] before:content-[''] before:bg-primary after:w-full after:h-[1px] after:content-[''] after:bg-primary gap-1 my-6">O</span>
      <Button variant="ghost" className="border h-auto w-full">
        <GoogleIcon />
        <span className="ml-2 text-base">Inicia sesión con Google</span>
      </Button>
    </div>
  )
}