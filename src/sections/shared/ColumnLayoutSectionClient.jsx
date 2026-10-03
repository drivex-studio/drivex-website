'use client'

import React from 'react'
import { cx } from '@/libs/utils/className'
import { ScrollAnimatedHeadline } from '@/components/animations/ScrollAnimatedHeadline'
import { SanityRichText } from '@/components/sanity/SanityRichText'
import { SanityMedia } from '@/components/sanity/SanityMedia'
import { SanityButton } from '@/components/sanity/SanityButton'
import { ButtonGroup } from '@/components/ui/ButtonGroup'
import { List } from '@/components/animations/List'
import { CardsSectionClient } from '@/sections/shared/CardsSectionClient'

// Grid span/start (1-12) and gap-* classes already exist in main.css,
// so they are built from the Sanity values directly.
const H_ALIGN = { start: 'items-start', center: 'items-center', end: 'items-end' }

const V_ALIGN = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
}

// selfAlign works on the column's vertical axis, so it uses auto margins (this is what the
// reference site renders: top -> mb-auto, bottom -> mt-auto). self-start / self-end would move
// the item left/right instead, because the column is flex-col.
const SELF_ALIGN = { top: 'mb-auto', center: 'my-auto', bottom: 'mt-auto' }

// Studio `mobileOrder` (1 = first). Same classes the reference renders: `order-N` on mobile,
// `lg:order-none` restores the grid-start/span placement on desktop. Full class names are written
// out so Tailwind can see them.
const MOBILE_ORDER = {
  1: 'order-1 lg:order-none',
  2: 'order-2 lg:order-none',
  3: 'order-3 lg:order-none',
  4: 'order-4 lg:order-none',
  5: 'order-5 lg:order-none',
  6: 'order-6 lg:order-none',
}

// Studio field is `style` (older documents may still carry `size`, so both are read).
// small = `section-label` class (mono, uppercase, brand color) like the reference site.
const ACCENT_STYLE = { small: 'section-label', default: 'text-accent', large: 'text-accent-lg' }

const ACCENT_COLOR = {
  foreground: '!text-foreground',
  brand: '', // section-label က brand color ရှိပြီးသား
  muted: '!text-foreground-muted',
}

// Divider padding. Same scale as TextSection (md = pt-32 lg:pt-64, which is what the
// BodyArmor reference renders). Full class names are written out so Tailwind sees them.
const DIVIDER_PT = {
  none: 'pt-0',
  xs: 'pt-8 lg:pt-16',
  sm: 'pt-16 lg:pt-32',
  md: 'pt-32 lg:pt-64',
  lg: 'pt-48 lg:pt-96',
  xl: 'pt-64 lg:pt-128',
}

const DIVIDER_PB = {
  none: 'pb-0',
  xs: 'pb-8 lg:pb-16',
  sm: 'pb-16 lg:pb-32',
  md: 'pb-32 lg:pb-64',
  lg: 'pb-48 lg:pb-96',
  xl: 'pb-64 lg:pb-128',
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

    case 'sectionHeaderComponent': {
      if (!c.headline?.text) return null
      return (
        <div
          key={c._key}
          className="flex w-full flex-row flex-wrap items-end justify-between gap-16"
        >
          <div>
            <ScrollAnimatedHeadline
              headline={{ text: c.headline.text, level: c.headline.level ?? 'h2' }}
            />
          </div>
          {c.label && <p className="section-label">{c.label}</p>}
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
        <div
          key={c._key}
          className={cx('max-lg:!max-w-full w-full', c.caption ? 'flex flex-col' : 'h-full')}
          style={{ maxWidth: c.maxWidth || undefined }}
        >
          <div
            className={cx('overflow-hidden', c.caption ? 'min-h-0 w-full flex-1' : 'h-full')}
            style={{ aspectRatio: toCssAspectRatio(c.aspectRatio) }}
          >
            <SanityMedia media={c.image} className="size-full object-cover" />
          </div>
          {c.caption && <p className="mt-8 shrink-0 text-foreground-muted text-sm">{c.caption}</p>}
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
        <div key={c._key} className={SELF_ALIGN[c.selfAlign]}>
          <ButtonGroup buttonGroup={c.buttonGroup} />
        </div>
      )
    }

    case 'accentTextComponent': {
      if (!c.text) return null
      return (
        <p
          key={c._key}
          className={cx(ACCENT_STYLE[c.style ?? c.size] ?? ACCENT_STYLE.small, ACCENT_COLOR[c.color] ?? ACCENT_COLOR.foreground)}
        >
          {c.text}
        </p>
      )
    }

    case 'cardsComponent': {
      if (!c.cards?.length) return null
      return (
        <div key={c._key} className="h-full w-full">
          <CardsSectionClient cards={c.cards} fullHeight />
        </div>
      )
    }

    case 'listComponent': {
      if (!c.items?.length) return null
      return (
        <List
          key={c._key}
          items={c.items}
          animated={c.animated ?? false}
          pushEffect={c.pushEffect ?? false}
        />
      )
    }

    case 'dividerComponent': {
      if (c.orientation === 'vertical') {
        return <div key={c._key} className="h-full self-stretch border-l border-border" />
      }
      return (
        <div
          key={c._key}
          className={cx('w-full', DIVIDER_PT[c.paddingTop], DIVIDER_PB[c.paddingBottom])}
        >
          <hr className="w-full border-border border-t" />
        </div>
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
              column.columnStart && `lg:grid-start-${column.columnStart}`,
              MOBILE_ORDER[column.mobileOrder]
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