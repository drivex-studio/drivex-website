'use client'

import React, { useRef } from 'react'
import { gsap, useGSAP, ScrollTrigger } from '@/libs/vendor'
import { cx } from '@/libs/utils/className'
import { ScrollAnimatedHeadline } from '@/components/animations/ScrollAnimatedHeadline'
import { List } from '@/components/animations/List'
import { SanityButton } from '@/components/sanity/SanityButton'
import { SanityRichText } from '@/components/sanity/SanityRichText'
import { SpotsBadge } from '@/components/ui/SpotsBadge'


const CARD_SPAN = {
  1: 'grid-span-12',
  2: 'grid-span-12 md:grid-span-6',
  3: 'grid-span-12 md:grid-span-4',
  4: 'grid-span-12 md:grid-span-6 lg:grid-span-3',
}

function PriceCard({ card, spotsRemaining, className }) {
  const {
    tag,
    bestFor,
    pricePrefix,
    priceAmount,
    priceCurrency,
    priceInterval,
    list,
    listAnimated,
    cardTheme,
    button,
  } = card

  const hasPrice = pricePrefix || priceAmount || priceCurrency || priceInterval

  return (
    <div
      data-price-card
      data-theme={cardTheme}
      className={cx(
        'flex min-h-600 flex-col bg-background-muted p-24',
        cardTheme === 'dark' && 'text-foreground',
        className
      )}
    >
      {tag && (
        <div className="mb-24 flex items-center gap-8">
          <span className="size-8 bg-brand" />
          <span className="text-accent">{tag}</span>
        </div>
      )}

      {hasPrice && (
        <div className="mb-32 flex flex-wrap items-baseline">
          {pricePrefix && (
            <span className="mr-8 text-body text-foreground-muted">{pricePrefix}</span>
          )}
          {priceCurrency && <span className="font-light text-h3">{priceCurrency}</span>}
          {priceAmount && <span className="font-light text-h3">{priceAmount}</span>}
          {priceInterval && (
            <span className="ml-8 text-body text-foreground-muted">{priceInterval}</span>
          )}
        </div>
      )}

      {list?.length > 0 && (
        <div className="mt-24">
          <List items={list} animated={listAnimated ?? false} />
        </div>
      )}

      <div className="mt-auto">
        {bestFor && (
          <div className="mt-32 mb-16 text-accent-sm text-foreground-muted lg:mt-48">
            {bestFor}
          </div>
        )}
        <SpotsBadge className="mb-16" spots={spotsRemaining} />
        {button && (
          <div>
            <SanityButton button={button} />
          </div>
        )}
      </div>
    </div>
  )
}

export function PricingSectionClient({ headline, text, cards, spotsRemaining }) {
  const gridRef = useRef(null)
  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const els = gsap.utils.toArray('[data-price-card]', gridRef.current)
      if (!els.length) return

      gsap.set(els, { opacity: 0, y: 40 })
      ScrollTrigger.batch(els, {
        start: 'top 85%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.1,
            overwrite: true,
          }),
      })
    },
    { scope: gridRef, dependencies: [cards.length] }
  )

  const span = CARD_SPAN[cards.length] ?? CARD_SPAN[3]

  return (
    <div className="grid-container">
      {headline?.text && (
        <div className="grid-layout mb-24 lg:mb-48">
          <div className="grid-span-12">
            <ScrollAnimatedHeadline
              headline={{ text: headline.text, level: headline.level ?? 'h2' }}
            />
          </div>
        </div>
      )}

      <div ref={gridRef} className="grid-layout gap-y-24">
        {cards.map((card) => (
          <PriceCard
            key={card._key}
            card={card}
            spotsRemaining={spotsRemaining}
            className={span}
          />
        ))}
      </div>

      {text?.length > 0 && (
        <div className="grid-layout mt-16 lg:mt-32">
          <div className="grid-span-12 text-center text-body text-foreground-muted">
            <SanityRichText value={text} />
          </div>
        </div>
      )}
    </div>
  )
}