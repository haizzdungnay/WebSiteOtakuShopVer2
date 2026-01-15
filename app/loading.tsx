export default function Loading() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-dark-bg transition-colors duration-200">
      {/* Header Skeleton */}
      <div className="bg-white dark:bg-dark-card border-b dark:border-dark-border transition-colors">
        <div className="container mx-auto px-4 py-6">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Skeleton */}
        <div className="flex gap-2 mb-6">
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-dark-card rounded-lg overflow-hidden shadow-sm dark:shadow-none dark:border dark:border-dark-border transition-colors">
              {/* Image Skeleton */}
              <div className="aspect-square bg-gray-200 animate-pulse"></div>
              
              {/* Content Skeleton */}
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
