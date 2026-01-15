export default function SaleLoading() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-dark-bg transition-colors duration-200">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-r from-orange-400 to-red-400">
        <div className="container mx-auto px-4 py-12">
          <div className="flex gap-2 mb-4">
            <div className="h-4 bg-white/30 rounded w-20 animate-pulse"></div>
            <div className="h-4 bg-white/30 rounded w-4 animate-pulse"></div>
            <div className="h-4 bg-white/30 rounded w-32 animate-pulse"></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/30 rounded-full animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-10 bg-white/30 rounded w-48 animate-pulse"></div>
              <div className="h-4 bg-white/30 rounded w-64 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filter Bar Skeleton */}
        <div className="bg-white dark:bg-dark-card rounded-lg dark:border dark:border-dark-border transition-colors p-4 mb-6 shadow-sm flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-dark-card rounded-lg overflow-hidden shadow-sm dark:shadow-none dark:border dark:border-dark-border transition-colors">
              <div className="aspect-square bg-gray-200 animate-pulse"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="flex items-center gap-2">
                  <div className="h-6 bg-orange-200 rounded w-16 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
