import { PricingSectionClient } from '@/sections/shared/PricingSectionClient'

const SECTION_CLASS_NAME = 'pt-32 lg:pt-64 pb-32 lg:pb-64 bg-background'

export function PricingSection({ content }) {
  if (!content?.priceCards?.length) return null

  return (
    <section
      data-page-builder-section="true"
      data-theme={content.theme}
      className={SECTION_CLASS_NAME}
    >
      <PricingSectionClient
        headline={content.headline}
        text={content.text}
        cards={content.priceCards}
        spotsRemaining={content.spotsRemaining}
      />
    </section>
  )
}