'use client'

import React from 'react'
import { cx } from '@/libs/utils/className'
import { ScrollAnimatedHeadline } from '@/components/animations/ScrollAnimatedHeadline'
import { SanityRichText } from '@/components/sanity/SanityRichText'
import { SanityMedia } from '@/components/sanity/SanityMedia'
import { SanityButton } from '@/components/sanity/SanityButton'
import { ButtonGroup } from '@/components/ui/ButtonGroup'

// Grid span/start (1-12) and gap-* classes already exist in main.css,
// so they are built from the Sanity values directly.
const H_ALIGN = { start: 'items-start', center: 'items-center', end: 'items-end' }

const V_ALIGN = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
}

// These are not in main.css yet, so keep the full class names written out
// (Tailwind generates them by scanning this file). "default" adds no class.
const SELF_ALIGN = { top: 'self-start', center: 'self-center', bottom: 'self-end' }

const ACCENT_STYLE = { small: 'text-accent-sm', default: 'text-accent', large: 'text-accent-lg' }

const ACCENT_COLOR = {
  foreground: '!text-foreground',
  brand: '!text-brand',
  muted: '!text-foreground-muted',
}

function toCssAspectRatio(value) {
  if (!value || value === 'auto') return undefined
  return value.replace('/', ' / ')
}

function renderComponent(c) {
  switch (c._type) {
    case 'headlineComponent': {
      if (!c.headline?.text) return null
      return (
        <div key={c._key} className={SELF_ALIGN[c.selfAlign]}>
          <ScrollAnimatedHeadline
            headline={{ text: c.headline.text, level: c.headline.level ?? 'h2' }}
          />
        </div>
      )
    }

    case 'textComponent': {
      if (!c.text?.length) return null
      return (
        <div key={c._key} className={cx('prose', SELF_ALIGN[c.selfAlign])}>
          <SanityRichText value={c.text} />
        </div>
      )
    }

    case 'imageComponent': {
      if (!c.image?.image) return null
      return (
        <div key={c._key} className="max-lg:!max-w-full w-full h-full">
          <div
            className="overflow-hidden h-full"
            style={{ aspectRatio: toCssAspectRatio(c.aspectRatio) }}
          >
            <SanityMedia media={c.image} className="size-full object-cover" />
          </div>
        </div>
      )
    }

    case 'buttonComponent': {
      if (!c.button) return null
      return (
        <div key={c._key} className={SELF_ALIGN[c.selfAlign]}>
          <SanityButton button={c.button} />
        </div>
      )
    }

    case 'buttonGroupComponent': {
      if (!c.buttonGroup?.buttons?.length) return null
      return (
        <div key={c._key}>
          <ButtonGroup buttonGroup={c.buttonGroup} />
        </div>
      )
    }

    case 'accentTextComponent': {
      if (!c.text) return null
      return (
        <p
          key={c._key}
          className={cx(ACCENT_STYLE[c.style], ACCENT_COLOR[c.color] ?? ACCENT_COLOR.foreground)}
        >
          {c.text}
        </p>
      )
    }

    default:
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[ColumnLayout] "${c._type}" is not implemented yet`)
      }
      return null
  }
}

export function ColumnLayoutSectionClient({ columns }) {
  return (
    <div className="grid-container">
      <div className="grid-layout gap-y-48">
        {columns.map((column) => (
          <div
            key={column._key}
            className={cx(
              'grid-span-12',
              column.columnSpan && `lg:grid-span-${column.columnSpan}`,
              column.columnStart && `lg:grid-start-${column.columnStart}`
            )}
          >
            <div
              className={cx(
                'flex h-full flex-col',
                V_ALIGN[column.verticalAlignment] ?? V_ALIGN.start,
                H_ALIGN[column.horizontalAlignment] ?? H_ALIGN.start,
                `gap-${column.spaceBetween ?? 16}`
              )}
            >
              {(column.components ?? []).map(renderComponent)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
