'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { composeRefs } from '@radix-ui/react-compose-refs'
import { createImageUrlBuilder } from '@sanity/image-url'
import { cx } from '@/libs/utils/className'
import { env } from '@/env'
import { run } from '@/libs/constants/run'
import { 
  DEFAULT_MAX_WIDTH,
  DEFAULT_MAX_HEIGHT, 
  DEFAULT_SOURCE_WIDTHS
} from '@/libs/constants/config'

import { Image, createResponsiveSizes } from '@/components/sanity/Image'
import { parseResponsiveValues } from '@/components/sanity/utils/parseResponsiveValues'
import { parseAspectRatio } from '@/components/sanity/utils/createResponsiveRatios'

const imageBuilder = createImageUrlBuilder({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET
})

const defaultBuilderOptions = {
  auto: 'format',
  quality: 90
}

export function getLqipBackgroundStyle({ lqip }) {
  return lqip ? {
    backgroundImage: `url(${lqip})`,
    backgroundSize: 'cover'
  } : null
}

function getCropDimensions(dimensions, options = {}) {
  const { crop } = options
  const { width, height } = dimensions

  if (!width || !height) return { width: undefined, height: undefined }
  if (!crop) return { width, height }

  const { left = 0, top = 0, right = 0, bottom = 0 } = crop
  const cropWidth = width - left * width - right * width
  const cropHeight = height - top * height - bottom * height

  return {
    width: cropWidth > 0 ? cropWidth : width,
    height: cropHeight > 0 ? cropHeight : height
  }
}

function calculateAspectRatio(image, options = {}) {
  if (!image?.dimensions) return undefined
  const { width, height } = getCropDimensions(image.dimensions, options)
  return width && height ? width / height : undefined
}

function applyAspectRatio(dimensions, aspectRatio, fallbackSize) {
  const { width, height } = dimensions

  if (width && height) return { width, height }
  if (width && !height) {
    return aspectRatio 
      ? { width, height: Math.round(width / aspectRatio) } 
      : { width, height: width }
  }
  if (height && !width) {
    return aspectRatio 
      ? { width: Math.round(height * aspectRatio), height } 
      : { width: height, height }
  }
  if (!fallbackSize) throw new Error('Unable to calculate dimensions. Provide a fallbackSize.')
  
  return applyAspectRatio(fallbackSize, aspectRatio)
}

function applyMaxLimits(dimensions, options = {}) {
  let { width, height } = dimensions
  const { maxWidth = DEFAULT_MAX_WIDTH, maxHeight = DEFAULT_MAX_HEIGHT } = options

  if (maxWidth && width > maxWidth) {
    const ratio = maxWidth / width
    width = maxWidth
    height = Math.round(height * ratio)
  }
  if (maxHeight && height > maxHeight) {
    const ratio = maxHeight / height
    height = maxHeight
    width = Math.round(width * ratio)
  }

  return { width, height }
}

export function getImageDimensions(image, options = {}) {
  const { width, height, aspectRatio, maxWidth, maxHeight } = options
  const calculatedAspectRatio = aspectRatio ?? calculateAspectRatio(image, { crop: image.crop })
  const originalWidth = image.dimensions?.width ?? Infinity

  const baseDimensions = applyAspectRatio(
    { width, height },
    calculatedAspectRatio,
    { width: Math.min(DEFAULT_SOURCE_WIDTHS[DEFAULT_SOURCE_WIDTHS.length - 1], originalWidth) }
  )

  return applyMaxLimits(baseDimensions, { maxWidth, maxHeight })
}

function buildUrlFromString(url, builderOpts = {}) {
  try {
    const u = new URL(url)
    const { width, height, fit, dpr, quality, auto } = builderOpts
    if (width) u.searchParams.set('w', width)
    if (height) u.searchParams.set('h', height)
    if (fit) u.searchParams.set('fit', fit)
    if (dpr && dpr !== 1) u.searchParams.set('dpr', dpr)
    if (quality) u.searchParams.set('q', quality)
    if (auto) u.searchParams.set('auto', auto)
    return u.toString()
  } catch {
    return url
  }
}

export function getImageSrc(image, options = {}) {
  const { width, height, aspectRatio, ...rest } = options

  const fit = run(() => {
    if (image?.crop) return 'crop'
    if (options.fit) return options.fit
    if ((width && height) || aspectRatio) return 'crop'
    return undefined
  })

  const dims = getImageDimensions(image, { width, height, aspectRatio })

  const buildUrl = (img, builderOpts = {}) => {
    // The source is already a plain image URL (not a Sanity asset reference),
    // so resize it via query params instead of the asset builder.
    if (typeof img === 'string') {
      return buildUrlFromString(img, { ...defaultBuilderOptions, ...builderOpts })
    }
    const builderImage = { ...img, _id: img._id ?? undefined }
    return imageBuilder.withOptions({ ...defaultBuilderOptions, ...builderOpts }).image(builderImage).url()
  }

  return buildUrl(image, {
    ...rest,
    fit,
    width: dims.width,
    height: dims.height
  })
}

export function getImageSrcSet(image, options = {}) {
  const { sourceWidths = DEFAULT_SOURCE_WIDTHS, ...rest } = options
  const originalWidth = image.dimensions?.width

  return run(() => {
    if (rest.width || rest.height || (originalWidth && originalWidth < sourceWidths[0])) {
      return [2, 3].map(dpr => {
        const src = getImageSrc(image, { ...rest, dpr })
        return `${src} ${dpr}x`
      })
    }

    const srcSet = sourceWidths.map(w => {
      if (originalWidth && originalWidth < w) return null
      const src = getImageSrc(image, { ...rest, height: undefined, width: w })
      return `${src} ${w}w`
    })

    if (originalWidth && !sourceWidths.includes(originalWidth)) {
      const largestSmallerWidth = sourceWidths.filter(w => originalWidth >= w).at(-1)
      if (largestSmallerWidth && originalWidth > largestSmallerWidth) {
        const src = getImageSrc(image, { ...rest, height: undefined, width: originalWidth })
        srcSet.push(`${src} ${originalWidth}w`)
      }
    }

    return srcSet
  }).filter(Boolean).join(', ')
}

const loadedImages = new Set()

function useImageVisibility(imageId, priority) {
  const isLoadedInitially = !!imageId && loadedImages.has(imageId)
  const initialVisible = priority || isLoadedInitially

  const [isLoaded, setIsLoaded] = useState(isLoadedInitially)
  const [isVisible, setIsVisible] = useState(initialVisible)
  const imgRef = useRef(null)

  const onLoad = useCallback(() => {
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (imgRef.current?.complete) {
      onLoad()
    }
  }, [onLoad])

  useEffect(() => {
    if (initialVisible) return

    const element = imgRef.current
    if (!element) return

    const observer = new IntersectionObserver(entries => {
      const [entry] = entries
      if (entry?.isIntersecting) {
        setIsVisible(true)
        if (imageId) loadedImages.add(imageId)
        observer.disconnect()
      }
    }, {
      rootMargin: '0px 0px -100px 0px'
    })

    observer.observe(element)
    return () => observer.disconnect()
  }, [initialVisible, imageId])

  return {
    ref: imgRef,
    visible: isLoaded && isVisible,
    onLoad
  }
}

export function SanityImage(props) {
  const {
    image,
    aspectRatio,
    builderOptions,
    style,
    alt,
    sizes,
    onLoad,
    width,
    height,
    noPlaceholder,
    priority,
    className,
    ref,
    ...restProps
  } = props

  const visibility = useImageVisibility(image?._id ?? undefined, priority)
  const mergedRef = composeRefs(visibility.ref, ref)

  const handleLoad = useCallback((e) => {
    visibility.onLoad()
    onLoad?.(e)
  }, [visibility.onLoad, onLoad])

  const hasImage = typeof image === 'string'
    ? image.length > 0
    : !!(image?._id || image?.asset)

  if (!hasImage) return null

  const responsiveSources = run(() => {
    if (aspectRatio) {
      return Object.entries(parseResponsiveValues(String(aspectRatio))).map(([bp, { value, resolvedWidth }]) => {
        if (!resolvedWidth) return null
        
        const bpOptions = {
          width: width ? Number(width) : undefined,
          height: height ? Number(height) : undefined,
          aspectRatio: value ? parseAspectRatio(value) : undefined,
          ...builderOptions
        }
        
        const dims = getImageDimensions(image, bpOptions)
        
        return {
          bp,
          srcSet: getImageSrcSet(image, bpOptions),
          sizes: sizes ? createResponsiveSizes(sizes) : undefined,
          width: dims.width,
          height: dims.height,
          media: `(min-width: ${resolvedWidth})`
        }
      }).filter(Boolean)
    }
  })

  const defaultAspectRatio = run(() => {
    if (aspectRatio) {
      const defaultValue = parseResponsiveValues(String(aspectRatio)).DEFAULT.value
      return defaultValue ? parseAspectRatio(defaultValue) : undefined
    }
  })

  const options = {
    width: width ? Number(width) : undefined,
    height: height ? Number(height) : undefined,
    aspectRatio: defaultAspectRatio,
    ...builderOptions
  }

  const dims = getImageDimensions(image, options)
  const src = getImageSrc(image, options)
  const srcSet = getImageSrcSet(image, options)
  
  const lqipStyle = visibility.visible || noPlaceholder ? undefined : getLqipBackgroundStyle({ lqip: image.lqip })
  const altText = alt ?? image.altText ?? image.description ?? image.title ?? ''

  const styleObj = {
    ...(width ? { '--desired-width': `${width}px` } : {}),
    ...(height ? { '--desired-height': `${height}px` } : {}),
    ...lqipStyle,
    ...style
  }

  return (
    <picture className={cx('relative flex items-center justify-center', className)}>
      {responsiveSources?.map(({ bp, ...sourceProps }) => (
        <source key={bp} {...sourceProps} />
      ))}
      <Image
        {...restProps}
        priority={priority}
        ref={mergedRef}
        onLoad={handleLoad}
        src={src}
        sizes={sizes}
        srcSet={srcSet}
        alt={altText}
        width={dims.width}
        height={dims.height}
        style={styleObj}
        className={cx(
          'h-(--desired-height,100%) w-(--desired-width,100%) max-w-full transition-opacity duration-700 ease-in-out',
          visibility.visible ? 'opacity-100' : 'opacity-0'
        )}
      />
      <span
        className={cx(
          'pointer-events-none absolute inset-0 bg-brand/[0.06] transition-opacity duration-700 ease-in-out',
          visibility.visible ? 'opacity-0' : 'opacity-100'
        )}
        aria-hidden="true"
      />
    </picture>
  )
}
