import { Skeleton } from "./UI/skeleton";

function WeatherSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <div className="grid gap-3 md:grid-cols-3">
          <Skeleton className="h-[120px] w-[80%] rounded-lg" />
          <Skeleton className="h-[120px] w-[80%] rounded-lg" />
          <Skeleton className="h-[120px] w-[80%] rounded-lg" />
        </div>
        <div className="flex gap-5 items-center">
          <Skeleton className="h-[300px] w-full rounded-lg" />
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[300px] w-full rounded-lg" />
          <Skeleton className="h-[600px] w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default WeatherSkeleton;
