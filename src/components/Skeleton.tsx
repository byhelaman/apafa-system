import { Skeleton } from "@/components/ui/skeleton"

interface SkeletonUserProps {
  cant?: number;
}

export function UserSkeleton({ cant = 1 }: SkeletonUserProps) {
  return (
    <div className="flex flex-col space-y-2">
      {
        Array.from({ length: cant }).map((_, i) => (
          <Skeleton key={i} className="h-[74px] w-full flex justify-between items-center border bg-transparent py-3 px-4">
            <div className="flex flex-col space-y-1 w-full max-w-32">
              <Skeleton className="h-7 w-full" />
              <Skeleton className="h-4 w-24 rounded-sm" />
            </div>
            <Skeleton className="h-6 w-16 rounded-lg" />
            <Skeleton className="h-10 w-11" />
          </Skeleton>
        ))
      }
    </div>
  )
}