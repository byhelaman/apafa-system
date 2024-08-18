import { useState } from "react";
import { ChevronLeft } from "lucide-react"
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
    history.back();

    setTimeout(() => {
      setIsDisabled(false);
    }, 300);
  }

  return (
    <div className="flex justify-between items-center">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Ajustes</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Button variant="ghost" size="icon" onClick={handleClick}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
    </div>
  )
}
