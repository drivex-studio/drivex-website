import { CardsSectionClient } from '@/sections/shared/CardsSectionClient'

export function CardsSection({ content }) {
  const cards = content?.cards
  if (!cards?.length) return null

  return (
    <section
      data-theme={content.theme}
      data-page-builder-section="cardsSection"
      className="bg-background pt-64 pb-64 lg:pt-128 lg:pb-128"
    >
      <div className="grid-container">
        <div className="grid-layout">
          <div className="grid-span-12">
            <CardsSectionClient cards={cards} />
          </div>
        </div>
      </div>
    </section>
  )
}
