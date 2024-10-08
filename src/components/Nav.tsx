import { useState } from "react";
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface NavProps {
  title: string;
}

export function Nav({ title }: NavProps) {
  const [isDisabled, setIsDisabled] = useState(false);

  const handleClick = () => {
    if (isDisabled) return;
    setIsDisabled(true);
    
    if (history.length <= 1) {
      location.href = "/";
    }

    history.back();

    setTimeout(() => {
      setIsDisabled(false);
    }, 300);
  }

  return (
    <div className="w-full flex justify-between items-center py-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="text-xl font-bold">APAFA</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-base">{title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Button variant="ghost" size="icon" onClick={handleClick}>
        <ArrowLeft className="h-6 w-6" />
      </Button>
    </div>
  )
}
