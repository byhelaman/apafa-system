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

interface InputInviteProps {
  text?: string
}

export function InputInvite({ text }: InputInviteProps) {
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("https//apafa.pe/cj4tM2A1n7e@puC4");
    setTooltipVisible(true);

    setTimeout(() => {
      setTooltipVisible(false);
    }, 500);
  };

  return (
    <div className="mt-20">
      <span className="block text-lg mb-2">{text}</span>
      <div className="flex items-center space-x-2 relative">
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
              <Button type="submit" onClick={handleCopy} size="sm" className="px-3 absolute right-1" variant="outline">
                <span className="sr-only">Copy</span>
                <Copy className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copiado!</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}