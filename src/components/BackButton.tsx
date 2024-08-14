import { useState } from "react";
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function BackButton() {

  const [isDisabled, setIsDisabled] = useState(false);

  const handleClick = () => {
    if (isDisabled) return;

    setIsDisabled(true);

    history.back();

    setTimeout(() => {
      setIsDisabled(false);
    }, 300);
  };

  return (
    <Button variant="outline" onClick={handleClick} >
      <ArrowLeft className="h-5 w-5" />
    </Button>
  )
}