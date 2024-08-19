import { useEffect, useState } from "react";
import { SkeletonUser } from "./SkeletonUser";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings2 } from "lucide-react";

export function CardUser() {
  const [data, setData] = useState([]);
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
        <SkeletonUser />
      </>
    )
  }

  return (
    <>
      <div className="flex flex-col space-y-2">
        {
          data.map((profile => {
            return <Card data={profile} />
          }))
        }
      </div>
    </>
  )
}

interface CardProps {
  data: {
    user_id: string;
    user_name: string;
    user_email: string;
    role: string;
    created_at: string;
  }
}

function Card({ data }: CardProps) {

  return (
    <div className="w-full flex justify-between items-center border bg-transparent rounded-lg py-3 px-4">
      <div className="flex flex-col">
        <p className="text-lg font-medium">{data.user_name}</p>
        <div className="w-24">
          <p className="text-sm truncate ...">{data.user_id}</p>
        </div>
      </div>
      <Badge variant="secondary" className="font-medium text-sm capitalize">{data.role}</Badge>
      <Button variant="ghost" className="p-3">
        <Settings2 className="h-5 w-5" />
      </Button>
    </div>
  )
}