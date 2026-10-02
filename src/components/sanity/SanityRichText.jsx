import React, { Children, isValidElement } from 'react'
import { cx } from '@/libs/utils/className'
import { PortableText } from '@portabletext/react' 
import { stegaClean } from '@sanity/client/stega' 
import { AnimatedProse } from '@/components/animations/AnimatedProse' 
import { AnimatedText } from '@/components/animations/AnimatedText' 
import { InnerParallax } from '@/components/animations/InnerParallax' 
import { SanityMedia } from '@/components/sanity/SanityMedia' 
import { SanityLink } from '@/components/sanity/SanityLink' 

function extractTextChildren(children) {
  return Children.toArray(children).map((child) =>
    typeof child === 'string'
      ? child
      : isValidElement(child) &&
        typeof child.props === 'object' &&
        child.props !== null &&
        'children' in child.props
      ? child.props.children
      : null
  )
}

function NumberList({ children }) {
  return (
    <ol className="flex list-none flex-col gap-8 text-body">
      {extractTextChildren(children).map((text, i) => (
        <li className="flex items-start gap-8" key={`list-${i}-${text}`}>
          <span className="shrink-0 text-foreground-muted">{i + 1}.</span>
          <AnimatedText>{text}</AnimatedText>
        </li>
      ))}
    </ol>
  )
}

function BulletList({ children }) {
  return (
    <ul className="flex list-none flex-col gap-8 text-body">
      {extractTextChildren(children).map((text, i) => (
        <li className="flex items-start gap-8" key={`list-${i}-${text}`}>
          <span
            className="mt-[0.5em] size-4 shrink-0 rounded-full bg-current"
            aria-hidden="true"
          />
          <AnimatedText>{text}</AnimatedText>
        </li>
      ))}
    </ul>
  )
}

function Heading4({ children }) {
  return (
    <h4 className="mt-8 text-h6 first:mt-0 lg:mt-16">
      <AnimatedText>{children}</AnimatedText>
    </h4>
  )
}

function Heading3({ children }) {
  return (
    <h3 className="mt-16 text-h5 first:mt-0 lg:mt-24">
      <AnimatedText>{children}</AnimatedText>
    </h3>
  )
}

function Heading2({ children }) {
  return (
    <h2 className="mt-24 text-h4 first:mt-0 lg:mt-32">
      <AnimatedText>{children}</AnimatedText>
    </h2>
  )
}

function NormalText({ children }) {
  return (
    <div className="text-body empty:hidden" data-paragraph={true}>
      <AnimatedText>{children}</AnimatedText>
    </div>
  )
}

function LinkField({ value, children }) {
  return (
    <SanityLink
      link={value}
      className="group relative no-underline outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {children}
      <span
        className="pointer-events-none absolute inset-x-0 -bottom-1"
        aria-hidden="true"
      >
        <span className="absolute inset-x-0 top-0 h-px origin-left scale-x-100 bg-current transition-transform delay-300 duration-700 [transition-timing-function:cubic-bezier(0.625,0.05,0,1)] group-hover:origin-right group-hover:scale-x-0 group-hover:delay-0 group-focus-visible:origin-right group-focus-visible:scale-x-0 group-focus-visible:delay-0" />
        <span className="absolute inset-x-0 top-0 h-px origin-right scale-x-0 bg-current transition-transform delay-0 duration-700 [transition-timing-function:cubic-bezier(0.625,0.05,0,1)] group-hover:origin-left group-hover:scale-x-100 group-hover:delay-300 group-focus-visible:origin-left group-focus-visible:scale-x-100 group-focus-visible:delay-300" />
      </span>
    </SanityLink>
  )
}

function HighlightColorField({ value, children }) {
  return (
    <span
      style={{ '--color-value': stegaClean(value.color) }}
      className="bg-(--color-value) text-inherit"
    >
      {children}
    </span>
  )
}

function TextColorField({ value, children }) {
  return (
    <span
      style={{ '--color-value': stegaClean(value.color) }}
      className="bg-inherit text-(--color-value)"
    >
      {children}
    </span>
  )
}

function Superscript({ children }) {
  return <sup className="text-[0.6em]">{children}</sup>
}

function Underline({ children }) {
  return <em className="not-italic underline underline-offset-2">{children}</em>
}

function StrongText({ children }) {
  return <strong className="font-bold">{children}</strong>
}

function ItalicText({ children }) {
  return <em className="italic">{children}</em>
}

function MediaBlock({ value, className }) {
  if (!value) return null

  const { media, caption } = value
  const aspectRatio = media?.aspectRatio ?? undefined

  return (
    <figure
      className={cx('flex flex-col gap-16', className)}
      data-rich-text-block="mediaBlock"
    >
      <InnerParallax overflow="60 lg:120" style={{ aspectRatio }}>
        <SanityMedia media={media} className="size-full" />
      </InnerParallax>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}

function InlineMediaField({ value }) {
  const media = value.media
  if (!media) return null

  return (
    <SanityMedia
      media={media}
      width={100}
      autoPlay={true}
      loop={true}
      videoProps={{
        noControls: true,
        muted: true,
        playsInline: true,
      }}
      className="inline-flex h-[1em] w-auto align-middle"
    />
  )
}

const sanityComponents = {
  types: {
    mediaBlock: MediaBlock,
    inlineMediaField: InlineMediaField,
  },
  marks: {
    em: ItalicText,
    strong: StrongText,
    underline: Underline,
    sup: Superscript,
    textColorField: TextColorField,
    highlightColorField: HighlightColorField,
    linkField: LinkField,
  },
  block: {
    normal: NormalText,
    h2: Heading2,
    h3: Heading3,
    h4: Heading4,
  },
  list: {
    bullet: BulletList,
    number: NumberList,
  },
}

export function SanityRichText({ value, className }) {
  if (!value) return null

  return (
    <AnimatedProse className={cx('flex flex-col gap-16', className)}>
      <PortableText
        value={value}
        onMissingComponent={false}
        components={sanityComponents}
      />
    </AnimatedProse>
  )
}
