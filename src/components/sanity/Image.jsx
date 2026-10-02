import { createImageUrlBuilder } from '@sanity/image-url'
import { preload } from 'react-dom'
import { env } from '@/env'
import { parseResponsiveValues } from '@/components/sanity/utils/parseResponsiveValues'

export function createResponsiveSizes(sizes) {
  let defaultWidth = '100vw'
  const queries = Object.entries(parseResponsiveValues(sizes))
    .map(([key, { value, resolvedWidth }]) => {
      if (key === 'DEFAULT') {
        defaultWidth = value
        return null
      }
      return `(min-width: ${resolvedWidth}) ${value}`
    })
    .filter(Boolean)

  return queries.length ? `${queries.join(', ')}, ${defaultWidth}` : defaultWidth
}

export function Image({
  sizes,
  src,
  srcSet,
  priority,
  alt = '',
  loading = priority ? 'eager' : 'lazy',
  decoding = loading === 'lazy' ? 'async' : 'auto',
  ...rest
}) {
  if (priority) {
    preload(src, {
      as: 'image',
      fetchPriority: 'high',
      imageSrcSet: srcSet,
      imageSizes: sizes ? createResponsiveSizes(sizes) : undefined
    })
  }

  return (
    <img
      loading={loading}
      fetchPriority={priority ? 'high' : undefined}
      decoding={decoding}
      alt={alt}
      src={src}
      srcSet={srcSet}
      sizes={sizes ? createResponsiveSizes(sizes) : undefined}
      {...rest}
    />
  )
}

const builder = createImageUrlBuilder({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET
})

export function urlFor(source) {
  return builder.image(source)
}
