import React from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showText?: boolean
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  className = '', 
  showText = false 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <img 
        src="/logo.svg" 
        alt="Compliance Seva Logo" 
        className={`${sizeClasses[size]} rounded-lg`}
      />
      {showText && (
        <div className="flex flex-col justify-center">
          <h1 className={`font-semibold text-gray-900 leading-tight ${textSizeClasses[size]}`}>
            Compliance Seva
          </h1>
          {size !== 'sm' && (
            <p className="text-xs text-gray-500 leading-tight">
              Legal Metrology Scanner
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default Logo