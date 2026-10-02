'use client'
import dynamic from 'next/dynamic'
import { useRef, Suspense } from 'react'
import { DEFAULT_MAX_WIDTH } from '@/libs/constants/config'
import { createResponsiveRatios } from '@/components/sanity/utils/createResponsiveRatios'
import { cx } from '@/libs/utils/className'
import { run } from '@/libs/constants/run'

const MuxPlayer = dynamic(
  () => import('@mux/mux-player-react').then((mod) => mod.MuxPlayer),
  {
    loadableGenerated: {
      modules: [490090],
    },
  }
)

function getThumbnailSize(size) {
  let ratio = Math.min(size / DEFAULT_MAX_WIDTH, 1)
  return Math.min(size, Math.round(300 + 300 * ratio ** 0.5))
}

export function SanityVideo(props) {
  const {
    video,
    aspectRatio,
    width,
    height,
    style,
    className,
    thumbnailTime,
    poster,
    animatedPoster,
    disablePoster,
    hoverPlayback,
    objectFit,
    objectPosition,
    ...rest
  } = props

  const isDisabledPoster = disablePoster !== undefined && disablePoster
  const isHoverPlayback = hoverPlayback !== undefined && hoverPlayback
  const objectFitValue = objectFit === undefined ? 'cover' : objectFit
  const objectPositionValue = objectPosition === undefined ? 'center' : objectPosition

  const playerRef = useRef(null)

  const handlePointerEnter = () => {
    isHoverPlayback && playerRef.current && playerRef.current.play()
  }

  const handlePointerLeave = () => {
    isHoverPlayback && playerRef.current && playerRef.current.pause()
  }

  const { playbackId, dimensions, thumbTime } = video ?? {}

  if (!playbackId) {
    return null
  }

  const resolvedWidth = width ?? dimensions?.width
  const resolvedHeight = height ?? dimensions?.height
  const resolvedAspectRatio =
    (width && height ? width / height : undefined) ??
    aspectRatio ??
    dimensions?.aspectRatio ??
    1.7777777777777777

  const responsiveRatios = createResponsiveRatios(resolvedAspectRatio)

  const posterUrl = run(() =>
    isDisabledPoster || !playbackId
      ? null
      : poster ||
        (function ({
          playbackId: pid,
          width: w,
          height: h,
          animated: anim,
          time: t = 1,
          fitMode: fit = 'preserve',
        }) {
          let url = `https://image.mux.com/${pid}/${
            anim ? 'animated.gif' : 'thumbnail.webp'
          }?time=${t}&fit_mode=${fit}`
          w && (url += `&width=${w}`)
          h && (url += `&height=${h}`)
          return url
        })({
          playbackId: playbackId,
          time: thumbTime ?? undefined,
          animated: animatedPoster,
          height: resolvedHeight ? getThumbnailSize(resolvedHeight) : undefined,
          width: resolvedWidth ? getThumbnailSize(resolvedWidth) : undefined,
        })
  )

  const resolvedPoster = isDisabledPoster ? '' : posterUrl ?? undefined
  const hasPosterUrl = !isDisabledPoster && !!posterUrl

  const containerStyle = {
    ...responsiveRatios.styles,
    '--desired-width': height ? 'auto' : resolvedWidth ? `${resolvedWidth}px` : 'auto',
    '--desired-height': height ? `${height}px` : 'auto',
    ...style,
  }

  const blurBackgroundImage = `url(${posterUrl})`

  const blurStyle = {
    filter: 'blur(20px)',
    backgroundImage: blurBackgroundImage,
    backgroundRepeat: 'no-repeat',
    backgroundSize: objectFitValue,
    backgroundPosition: objectPositionValue,
  }

  const containerClassName = cx(
    'relative isolate h-(--desired-height,auto) w-(--desired-width,auto) max-w-full overflow-hidden',
    responsiveRatios.className,
    className
  )

  const onPointerEnter = isHoverPlayback ? handlePointerEnter : undefined
  const onPointerLeave = isHoverPlayback ? handlePointerLeave : undefined

  const placeholder = hasPosterUrl ? (
    <div
      style={blurStyle}
      className="pointer-events-none absolute inset-0 -z-1 size-full"
    />
  ) : null

  const resolvedThumbTime = thumbTime ?? undefined

  const player = (
    <MuxPlayer
      poster={resolvedPoster}
      ref={playerRef}
      playbackId={playbackId}
      thumbnailTime={resolvedThumbTime}
      objectFit={objectFitValue}
      objectPosition={objectPositionValue}
      className="absolute inset-0 z-10 size-full"
      {...rest}
    />
  )

  return (
    <div
      style={containerStyle}
      className={containerClassName}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <Suspense fallback={placeholder}>{player}</Suspense>
    </div>
  )
}