import { useState } from "react"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"


import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// default styles
const InputStyle = "h-auto text-lg px-4 bg-slate-100 pr-14"

export function InputInvite() {
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("https://apafa.pe/cj4tM2A1n7e@puC4");
    setTooltipVisible(true);

    setTimeout(() => {
      setTooltipVisible(false);
    }, 500);
  };

  return (
    <div className="mt-16">
      <span className="relative flex justify-center items-center w-full before:w-full before:h-[1px] before:content-[''] before:bg-primary my-6"></span>
      <span className="block text-sm">*Los padres de familia que deseen afiliarse a la <span className="uppercase">apafa</span> deben ingresar a este <a href="/register" className="underline text-blue-600">enlace</a>.</span>
      {/* <div className="flex items-center space-x-2 relative">
        <div className="grid flex-1 gap-2">
          <Label htmlFor="link" className="sr-only">
            Link
          </Label>
          <Input
            id="link"
            defaultValue="https//apafa.pe/cj4tM2A1n7e@puC4"
            readOnly
            className={InputStyle}
          />
        </div>
        <TooltipProvider>
          <Tooltip open={tooltipVisible}>
            <TooltipTrigger asChild>
              <Button variant="outline" onClick={handleCopy} size="sm" className="px-3 absolute right-1" >
                <span className="sr-only">Copy</span>
                <Copy className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copiado!</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div> */}
    </div>
  )
}