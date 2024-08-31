import { useEffect, useState } from "react";
import { UserSkeleton } from "./Skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Ellipsis, Loader2 } from "lucide-react";
import {
  DropdownMenu as Dropdown,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDown, Plus, X } from "lucide-react"

import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Profile {
  partner_id: string;
  dni: string;
  first_names: string;
  last_names: string;
  phone: string;
  email: string;
  address: string;
  education_level: string
  occupation: string
  marital_status: string
  created_at: string;
  status: string;
  children: Child[];
}

interface Child {
  first_names: string;
  dni: string;
  school_grade: string;
}

export function MemberCard() {

  const [isOpen, setIsOpen] = useState(false)

  const [data, setData] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = async (page: number) => {
    try {
      const response = await fetch(`/api/members?page=${page}&limit=2`);
      const result = await response.json();
      if (result.length < 2) {
        setHasMore(false);
      }
      
      setData(prevData => {
        const newData = result.filter((profile: Profile) => !prevData.some(p => p.partner_id === profile.partner_id));
        return [...prevData, ...newData];
      });

    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return;

      const scrollableHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = window.innerHeight;

      if (scrollTop + clientHeight >= scrollableHeight - 100) {
        setLoading(true);
        setPage(prevPage => prevPage + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading, hasMore]);

  // if (loading && page === 1) {
  //   return <div>Loading...</div>;
  // }

  return (
    <>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full space-y-2"
      >
        <div className="flex items-center justify-between px-4 pr-16 py-2 border rounded-md relative">
          <h4 className="text-lg font-medium"> Lista de espera</h4>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="absolute top-1 right-1">
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="space-y-2">
          {
            loading && page === 1 ? (
              'Loading...'
            ) : (
              <div className="grid sm:grid-cols-2 gap-2">
                {data.map(profile => (
                  <Card key={profile.partner_id} data={profile} />
                ))}
              </div>
            )
          }
        </CollapsibleContent>
      </Collapsible>
      
      {/* {loading && hasMore && (
        <div className="text-center mt-4">
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Cargando más...
          </Button>
        </div>
      )} */}
    </>
  );
}

// export function MemberCard() {
//   const [data, setData] = useState<Profile[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);

//   const fetchData = async (page: number) => {
//     try {
//       const response = await fetch(`/api/members?page=${page}&limit=2`);
//       const result = await response.json();
//       if (result.length < 2) {
//         setHasMore(false);
//       }
//       setData(prevData => [...prevData, ...result]);
//     } catch (error) {
//       console.error('Failed to fetch data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData(page);
//   }, [page]);

//   const handleLoadMore = () => {
//     setLoading(true);
//     setPage(prevPage => prevPage + 1);
//   };

//   if (loading && page === 1) {
//     return (
//       <div>Loading...</div>
//     );
//   }

//   return (
//     <>
//       <div className="grid sm:grid-cols-2 gap-2">
//         {data.map(profile => (
//           <Card key={profile.member_id} data={profile} />
//         ))}
//       </div>
//       {hasMore && (
//         <div className="text-center mt-4">
//           <Button onClick={handleLoadMore} disabled={loading}>
//             {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//             Cargar más
//           </Button>
//         </div>
//       )}
//     </>
//   );
// }

interface CardProps {
  data: Profile;
}

function Card({ data }: CardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const firstName = data.first_names.split(" ")[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `${data.first_names} ${data.last_names}\n${data.dni}\n${data.email}`
    );
  };

  const handleClick = () => {
    setIsModalOpen(true);
  }

  return (
    <div className="w-full h-fit border bg-transparent rounded-lg p-4 pb-6 min-h-52 relative space-y-4">
      <div>
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between gap-4">
              <h3 className="text-2xl font-semibold truncate">{`${firstName} ${data.last_names}`}</h3>
              <span className="text-2xl font-semibold inline-block mb-2">+{data.children.length}</span>
            </div>
            <div className="flex gap-1">
              <Badge variant="secondary" className="rounded-md">{data.status}</Badge>
              <Badge variant="outline" className="rounded-md">{format(data.created_at, "P", { locale: es })}</Badge>
            </div>
          </div>
          <div>
            <span className="block text-lg">{data.dni}</span>
            <span className="block text-lg">+51 {data.phone}</span>
            <span className="block text-lg truncate">{data.address}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          data={data}
        />
        <Button variant="outline" className="w-full p-2 text-lg" onClick={handleClick}>Detalles</Button>
      </div>
      {/* <div className="absolute top-1 right-1">
        <Dropdown>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="p-2">
              <Ellipsis className="w-5 h-4" />  
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-[100px]">
            <DropdownMenuItem onClick={handleCopy}>
              <span className="w-full cursor-pointer">Copiar</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <a href="" className="w-full">Editar</a>
            </DropdownMenuItem>
            <DropdownMenuSeparator/>
            <DropdownMenuItem>
              <a href="" className="w-full">Eliminar</a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </Dropdown>
      </div> */}
    </div>
  );
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Profile
}

function Modal({ isOpen, onClose, data }: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{`${data.first_names} ${data.last_names}`}</DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Información de usuario
        </DialogDescription>
        <div className="">
          <div className="">
            <h4>@member</h4>
            <div className="flex gap-2">
              <Badge variant="secondary">@status</Badge>
              <Badge variant="secondary">@date</Badge>
            </div>
          </div>
          <div className="grid py-4">
            <span>@phone</span>
            <span>@address</span>
          </div>
          <div className="space-y-2">
            {
              data.children.map(child => {
                return (
                  <div key={child.dni} className="w-full flex justify-between items-center border rounded-md p-4">
                    <div className="">
                      <h4>{child.first_names}</h4>
                      <span>{child.dni}</span>
                    </div>
                    <Badge variant="secondary">{child.school_grade}</Badge>
                  </div>
                )
              })
            }
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="w-full p-2 text-lg">Rechazar</Button>
          <Button className="w-full p-2 text-lg">Aceptar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}