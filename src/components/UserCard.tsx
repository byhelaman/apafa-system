import { useEffect, useState } from "react";
import { UserSkeleton } from "./Skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings2 } from "lucide-react";

interface Profile {
  user_id: string;
  user_name: string;
  user_email: string;
  role: string;
  created_at: string;
}

export function UserCard() {
  const [data, setData] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      const response = await fetch('/api/profiles', {
        method: 'GET'
      }).then(data => data.json());

      setData(response);
      setLoading(false);
    }

    onLoad();
  }, []);

  if (loading) {
    return (
      <>
        <UserSkeleton cant={6} />
      </>
    )
  }

  return (
    <>
      <div className="flex flex-col space-y-2">
        {
          data.map((profile => {
            return <Card key={profile.user_id} data={profile} />
          }))
        }
      </div>
    </>
  )
}

interface CardProps {
  data: Profile
}

function Card({ data }: CardProps) {

  return (
    <div className="w-full flex justify-between items-center border bg-transparent rounded-lg py-3 px-4">
      <div className="flex flex-col w-full max-w-32">
        <p className="text-lg font-medium">{data.user_name}</p>
        <p className="text-sm truncate">{data.user_id}</p>
      </div>
      <Badge variant="secondary" className="font-medium text-sm capitalize rounded-lg">{data.role}</Badge>
      <Button variant="ghost" className="p-3">
        <Settings2 className="h-5 w-5" />
      </Button>
    </div>
  )
}