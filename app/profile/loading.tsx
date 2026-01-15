export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-dark-bg transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex gap-2 mb-6">
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm dark:shadow-none dark:border dark:border-dark-border transition-colors p-6">
              {/* Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 bg-gray-200 rounded-full animate-pulse mb-4"></div>
                <div className="h-5 bg-gray-200 rounded w-32 animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
              </div>

              {/* Menu Items */}
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg">
                    <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm dark:shadow-none dark:border dark:border-dark-border transition-colors p-6">
              <div className="h-6 bg-gray-200 rounded w-40 mb-6 animate-pulse"></div>

              {/* Profile Form Skeleton */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>

                <div>
                  <div className="h-4 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>

                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
