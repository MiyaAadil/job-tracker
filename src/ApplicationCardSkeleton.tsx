const ApplicationCardSkeleton = () => (

  <div className="border border-gray-200 rounded-xl p-4 flex justify-between items-start animate-pulse">
    <div className="flex-1">
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/3" />
    </div>
    <div className="flex flex-col items-end gap-2">
      <div className="h-6 bg-gray-200 rounded w-20" />
      <div className="h-3 bg-gray-200 rounded w-10" />
    </div>
  </div>
);

export default ApplicationCardSkeleton;