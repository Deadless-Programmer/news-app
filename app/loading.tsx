// app/loading.tsx 
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      <p className="ml-4 text-xl text-gray-600">Loading page...</p>
    </div>
  )
}