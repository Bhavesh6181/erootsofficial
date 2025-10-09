import React from 'react'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Image - contains both graphic and text */}
      <div className={`${sizeClasses[size]} flex-shrink-0`}>
        <img
          src="/images/eroots-logo.png"
          alt="E_roots Logo"
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* Company Name */}
      <div className="flex flex-col">
        <div className={`font-bold text-gray-900 ${textSizeClasses[size]}`}>
          Eroots Technology
        </div>
      </div>
    </div>
  )
}

export default Logo
