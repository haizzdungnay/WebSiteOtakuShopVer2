export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-dark-bg transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Skeleton */}
        <div className="flex gap-2 mb-6">
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>

        {/* Title Skeleton */}
        <div className="h-8 bg-gray-200 rounded w-48 mb-8 animate-pulse"></div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Info Card */}
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm dark:shadow-none dark:border dark:border-dark-border transition-colors p-6">
              <div className="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse"></div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm dark:shadow-none dark:border dark:border-dark-border transition-colors p-6">
              <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 border rounded-lg">
                    <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="w-12 h-8 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm dark:shadow-none dark:border dark:border-dark-border transition-colors p-6 sticky top-24">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-200 rounded animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <div className="h-5 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div className="h-5 bg-gray-200 rounded w-28 animate-pulse"></div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="h-12 bg-gray-200 rounded mt-6 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
