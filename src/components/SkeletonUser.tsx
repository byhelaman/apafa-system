import { Skeleton } from "@/components/ui/skeleton"

interface SkeletonUserProps {
  cant?: number;
}

export function SkeletonUser({ cant = 1 }: SkeletonUserProps) {
  return (
    <div className="flex flex-col space-y-2">
      {
        Array.from({ length: cant }).map((_, i) => (
          <Skeleton key={i} className="h-auto w-full flex justify-between items-center border bg-transparent py-3 px-4">
            <div className="flex flex-col space-y-2 w-full max-w-32">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-10 w-10" />
          </Skeleton>
        ))
      }
    </div>
  )
}