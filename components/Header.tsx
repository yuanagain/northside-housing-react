export default function Header() {
  return (
    <header className="gradient-bg text-white shadow-xl">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl">🏥</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                Northside Housing Explorer
              </h1>
              <p className="text-blue-100 text-sm">
                Find perfect apartments near Northside Hospital locations
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <div className="glass-effect text-gray-800 px-4 py-2 rounded-lg">
              <div className="text-sm font-medium">🚗 Real-time Drive Times</div>
              <div className="text-xs">Updated traffic conditions</div>
            </div>
            <div className="glass-effect text-gray-800 px-4 py-2 rounded-lg">
              <div className="text-sm font-medium">📍 6 Hospital Locations</div>
              <div className="text-xs">Across metro Atlanta</div>
            </div>
            <div className="glass-effect text-gray-800 px-4 py-2 rounded-lg">
              <div className="text-sm font-medium">🏠 250+ Properties</div>
              <div className="text-xs">Verified apartment data</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative wave */}
      <div className="relative">
        <svg className="w-full h-6" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M0,0 C0,0 400,100 600,100 S1200,0 1200,0 L1200,120 L0,120 Z"
            fill="rgb(249, 250, 251)"
          />
        </svg>
      </div>
    </header>
  )
}