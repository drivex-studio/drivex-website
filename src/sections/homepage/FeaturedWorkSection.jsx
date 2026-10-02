import { FeaturedWorkSectionClient } from '@/sections/shared/FeaturedWorkSectionClient'

export function FeaturedWorkSection({ content }) {
  if (!content?.caseStudies?.length) return null

  return (
    <section
      data-theme={content.theme}
      data-page-builder-section="featuredWorkSection"
      className="bg-background pt-64 pb-64 lg:pt-128 lg:pb-128"
    >
      <FeaturedWorkSectionClient section={{ content }} />
    </section>
  )
}
