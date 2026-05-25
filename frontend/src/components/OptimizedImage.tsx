import React, { useState, useEffect, useRef } from 'react'

interface OptimizedImageProps {
    src: string
    alt: string
    className?: string
    width?: number
    height?: number
    priority?: boolean
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    className = '',
    width,
    height,
    priority = false,
}) => {
    const [isLoaded, setIsLoaded] = useState(false)
    const [isInView, setIsInView] = useState(priority)
    const imgRef = useRef<HTMLImageElement>(null)

    useEffect(() => {
        if (priority) return // Skip intersection observer for priority images

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true)
                        observer.disconnect()
                    }
                })
            },
            {
                rootMargin: '50px', // Start loading 50px before image enters viewport
            }
        )

        if (imgRef.current) {
            observer.observe(imgRef.current)
        }

        return () => {
            observer.disconnect()
        }
    }, [priority])

    return (
        <div
            ref={imgRef}
            className={`relative overflow-hidden bg-gray-200 dark:bg-gray-800 ${className}`}
            style={{ width, height }}
        >
            {/* Blur placeholder */}
            {!isLoaded && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800" />
            )}

            {/* Actual image - only load when in view */}
            {isInView && (
                <img
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    loading={priority ? 'eager' : 'lazy'}
                    decoding="async"
                    onLoad={() => setIsLoaded(true)}
                    className={`
            ${className}
            transition-opacity duration-300
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
          `}
                    style={{
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%',
                    }}
                />
            )}
        </div>
    )
}

export default OptimizedImage
