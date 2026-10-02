'use client'
import { useRef, useState, useEffect } from 'react'
import { createResponsiveRatios } from '@/components/sanity/utils/createResponsiveRatios'
import { cx } from '@/libs/utils/className'

export function ExternalVideo(props) {
  const {
    src,
    aspectRatio,
    width,
    height,
    style,
    className,
    loop,
    autoPlay,
    muted,
    controls,
    objectFit,
    objectPosition,
    ...rest
  } = props

  const showControls = controls !== undefined && controls
  const objectFitValue = objectFit === undefined ? 'cover' : objectFit
  const objectPositionValue = objectPosition === undefined ? 'center' : objectPosition

  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry?.isIntersecting) {
          setIsIntersecting(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '200px',
      }
    )

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  if (!src) return null

  const resolvedAspectRatio = aspectRatio ?? 1.7777777777777777

  const responsiveRatios = createResponsiveRatios(resolvedAspectRatio)

  const containerStyle = {
    ...responsiveRatios.styles,
    '--desired-width': height ? 'auto' : width ? `${width}px` : 'auto',
    '--desired-height': height ? `${height}px` : 'auto',
    ...style,
  }

  const containerClassName = cx(
    'relative isolate h-(--desired-height,auto) w-(--desired-width,auto) max-w-full overflow-hidden',
    responsiveRatios.className,
    className
  )

  return (
    <div ref={containerRef} style={containerStyle} className={containerClassName}>
      {isIntersecting && (
        <video
          ref={videoRef}
          {...rest}
          src={src}
          loop={loop !== false}
          muted={muted !== false}
          autoPlay={autoPlay !== false}
          controls={showControls === true}
          playsInline={true}
          preload="auto"
          className="absolute inset-0 size-full"
          style={{
            objectFit: objectFitValue,
            objectPosition: objectPositionValue,
          }}
        />
      )}
    </div>
  )
}