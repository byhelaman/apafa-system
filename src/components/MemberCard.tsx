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
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Profile {
  member_id: string;
  registration_code: string;
  dni: string;
  first_names: string;
  last_names: string;
  phone: string;
  email: string;
  address: string;
  created_at: string;
  states: { status: string };
}

export function MemberCard() {
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
      setData(prevData => [...prevData, ...result]);
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

  if (loading && page === 1) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="grid sm:grid-cols-2 gap-2">
        {data.map(profile => (
          <Card key={profile.member_id} data={profile} />
        ))}
      </div>
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
  const firstName = data.first_names.split(" ")[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `${data.registration_code}\n${data.first_names} ${data.last_names}\n${data.dni}\n${data.email}`
    );
  };

  return (
    <div className="w-full border bg-transparent rounded-lg p-4 pb-6 min-h-52 relative">
      <div>
        <span className="text-lg font-medium inline-block mb-2">{data.registration_code}</span>
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-2xl font-semibold">{`${firstName} ${data.last_names}`}</h3>
            <div className="flex gap-1">
              <Badge variant="secondary" className="rounded-md">{data.states.status}</Badge>
              <Badge variant="outline" className="rounded-md">{format(data.created_at, "P", { locale: es })}</Badge>
            </div>
          </div>
          <div>
            <span className="block text-lg">{data.dni}</span>
            <span className="block text-lg">{data.phone}</span>
            <span className="block text-lg">{data.address}</span>
          </div>
        </div>
      </div>
      <div className="absolute top-1 right-1">
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
      </div>
    </div>
  );
}
