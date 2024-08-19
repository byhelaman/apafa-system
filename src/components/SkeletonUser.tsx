import { Skeleton } from "@/components/ui/skeleton"

interface SkeletonUserProps {
  cant?: number;
}

export function SkeletonUser({ cant = 1 }: SkeletonUserProps) {
  return (
    <div className="flex flex-col space-y-2">
      {
        Array.from({ length: cant }).map((_, i) => (
          <Skeleton key={i} className="h-auto w-full flex justify-between items-center border bg-transparent p-3">
            <div className="flex flex-col space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-10 w-10" />
          </Skeleton>
        ))
      }
    </div>
  )
}