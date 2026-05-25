import React from 'react'

const LoadingFallback: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="text-center">
        {/* E_roots Branded Logo */}
        <div className="mb-8 animate-pulse">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
            <div className="text-white font-bold">
              <svg
                className="w-12 h-12"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* E_roots Logo - Circuit Board Style */}
                <path
                  d="M12 14H28M12 24H32M12 34H28"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="32" cy="14" r="2" fill="currentColor" />
                <circle cx="36" cy="24" r="2" fill="currentColor" />
                <circle cx="32" cy="34" r="2" fill="currentColor" />
              </svg>
            </div>
          </div>
        </div>

        {/* Loading progress bar */}
        <div className="space-y-2">
          <div className="h-2 w-48 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-loading-bar"></div>
          </div>
          <p className="text-sm text-gray-400 animate-pulse">Loading...</p>
        </div>
      </div>

      <style>{`
        @keyframes loading-bar {
          0% {
            width: 0%;
          }
          50% {
            width: 70%;
          }
          100% {
            width: 100%;
          }
        }
        .animate-loading-bar {
          animation: loading-bar 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default LoadingFallback
