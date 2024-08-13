import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    address: string;
    email: string;
    first_names: string;
    last_names: string;
    member_id: string;
    phone: string;
    registration_code: string;
    created_at: string;
    dni: string;
    status: string;
    children: {
      first_names: string;
      last_names: string;
      grade: string;
    }[];
  };
}
export default function Modal({ isOpen, onClose, data }: ModalProps) {
  const { first_names, last_names, dni, phone, address, children } = data;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-left">
          <DialogTitle>{data.registration_code}</DialogTitle>
          <div className="flex flex-col gap-2">
            <h2>{first_names} {last_names}</h2>
            <div className="flex">
              <Badge>{data.status}</Badge>
              <Badge>{new Date(data.created_at).toLocaleDateString()}</Badge>
            </div>
          </div>
          <DialogDescription>
            <span className="block">{dni}</span>
            <span className="block">{phone}</span>
            <span className="block">{address}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {children.length ? (
            children.map((child, index) => (
              <div key={index} className="border p-2 rounded flex justify-between items-center">
                <div className="">
                  <h4>{child.first_names} {child.last_names}</h4>
                  <span>+add DNI</span>
                </div>
                <Badge>{child.grade}</Badge>
              </div>
            ))
          ) : (
            <p>No children data available</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}