export default function LoadingSpinner() {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center">
      <div className="text-center text-white">
        <div className="mb-8">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 p-3">
            <img
              src="/images/anchormatch_logo_black.png"
              alt="Anchormatch"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold mb-2">Anchormatch Explorer</h1>
          <p className="text-blue-100">Loading your apartment search experience...</p>
        </div>

        <div className="flex items-center space-x-2 justify-center">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="glass-effect text-gray-800 p-4 rounded-lg">
            <div className="text-lg mb-1">🗺️</div>
            <div className="text-sm font-medium">Interactive Maps</div>
            <div className="text-xs">Real-time drive times</div>
          </div>
          <div className="glass-effect text-gray-800 p-4 rounded-lg">
            <div className="text-lg mb-1">🏠</div>
            <div className="text-sm font-medium">250+ Properties</div>
            <div className="text-xs">Verified listings</div>
          </div>
          <div className="glass-effect text-gray-800 p-4 rounded-lg">
            <div className="text-lg mb-1">🏥</div>
            <div className="text-sm font-medium">6 Hospitals</div>
            <div className="text-xs">Metro Atlanta</div>
          </div>
        </div>
      </div>
    </div>
  )
}