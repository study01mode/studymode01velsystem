interface FormLoadingSkeletonProps {
  fields?: number;
}

function FormLoadingSkeleton({ fields = 4 }: FormLoadingSkeletonProps) {
  return (
    <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
      <div className="animate-pulse">
        <div className="h-6 sm:h-8 bg-gray-200 rounded w-32 sm:w-48 mb-4 sm:mb-6"></div>
        <div className="space-y-4 sm:space-y-6">
          {Array.from({ length: fields }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="h-4 sm:h-6 bg-gray-200 rounded w-24 sm:w-32 mb-3 sm:mb-4"></div>
              <div className="h-8 sm:h-10 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FormLoadingSkeleton;
