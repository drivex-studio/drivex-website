import React, { Children, isValidElement } from 'react'
import { cx } from '@/libs/utils/className'
import { PortableText } from '@portabletext/react'
import { stegaClean } from '@sanity/client/stega'
import { AnimatedProse } from '@/components/animations/AnimatedProse'
import { AnimatedText } from '@/components/animations/AnimatedText'
import { InnerParallax } from '@/components/animations/InnerParallax'
import { SanityMedia } from '@/components/sanity/SanityMedia'
import { SanityLink } from '@/components/sanity/SanityLink'
import styles from '@/styles/SanityRichText.module.scss'

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
    <ol className={styles.numberList}>
      {extractTextChildren(children).map((text, i) => (
        <li className={styles.item} key={`list-${i}-${text}`}>
          <span className={styles.number}>{i + 1}.</span>
          <AnimatedText>{text}</AnimatedText>
        </li>
      ))}
    </ol>
  )
}

function BulletList({ children }) {
  return (
    <ul className={styles.bulletList}>
      {extractTextChildren(children).map((text, i) => (
        <li className={styles.item} key={`list-${i}-${text}`}>
          <span className={styles.bullet} aria-hidden="true" />
          <AnimatedText>{text}</AnimatedText>
        </li>
      ))}
    </ul>
  )
}

function Heading4({ children }) {
  return (
    <h4 className={styles.h4}>
      <AnimatedText>{children}</AnimatedText>
    </h4>
  )
}

function Heading3({ children }) {
  return (
    <h3 className={styles.h3}>
      <AnimatedText>{children}</AnimatedText>
    </h3>
  )
}

function Heading2({ children }) {
  return (
    <h2 className={styles.h2}>
      <AnimatedText>{children}</AnimatedText>
    </h2>
  )
}

function NormalText({ children }) {
  return (
    <div className={styles.paragraph} data-paragraph={true}>
      <AnimatedText>{children}</AnimatedText>
    </div>
  )
}

function LinkField({ value, children }) {
  return (
    <SanityLink link={value} className={styles.link}>
      {children}
      <span className={styles.line} aria-hidden="true" />
    </SanityLink>
  )
}

function HighlightColorField({ value, children }) {
  return (
    <span
      style={{ '--color-value': stegaClean(value.color) }}
      className={styles.highlight}
    >
      {children}
    </span>
  )
}

function TextColorField({ value, children }) {
  return (
    <span
      style={{ '--color-value': stegaClean(value.color) }}
      className={styles.textColor}
    >
      {children}
    </span>
  )
}

function Superscript({ children }) {
  return <sup className={styles.sup}>{children}</sup>
}

function Underline({ children }) {
  return <em className={styles.underline}>{children}</em>
}

function StrongText({ children }) {
  return <strong className={styles.strong}>{children}</strong>
}

function ItalicText({ children }) {
  return <em className={styles.italic}>{children}</em>
}

function MediaBlock({ value, className }) {
  if (!value) return null

  const { media, caption } = value
  const aspectRatio = media?.aspectRatio ?? undefined

  return (
    <figure
      className={cx(styles.mediaBlock, className)}
      data-rich-text-block="mediaBlock"
    >
      <InnerParallax overflow="60 lg:120" style={{ aspectRatio }}>
        <SanityMedia media={media} className={styles.media} />
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
      className={styles.inlineMedia}
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
    <AnimatedProse className={cx(styles.root, className)}>
      <PortableText
        value={value}
        onMissingComponent={false}
        components={sanityComponents}
      />
    </AnimatedProse>
  )
}
