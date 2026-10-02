import { HeroSection } from '@/sections/homepage/HeroSection'
import { CardsSection } from '@/sections/homepage/CardsSection'
// import { LogoSection } from '@/sections/homepage/LogoSection'
// import { AnimatedListSection } from '@/sections/homepage/AnimatedListSection'
// import { FeaturedWorkSection } from '@/sections/homepage/FeaturedWorkSection'
// import { IndexedGridSection } from '@/sections/homepage/IndexedGridSection'
// import { AccordionSection } from '@/sections/homepage/AccordionSection'
// import { ColumnLayoutSection } from '@/sections/homepage/ColumnLayoutSection'

const sectionMap = {
  heroSectionField: HeroSection,
  cardsSectionField: CardsSection,
  // logoSectionField: LogoSection,
  // animatedListSectionField: AnimatedListSection,
  // featuredWorkSectionField: FeaturedWorkSection,
  // indexedGridSectionField: IndexedGridSection,
  // accordionSectionField: AccordionSection,
  // columnLayoutSectionField: ColumnLayoutSection,
}

export function SectionRenderer({ sections }) {
  return (sections ?? []).map((s) => {
    const Component = sectionMap[s._type]
    if (!Component) return null
    return <Component key={s._key} content={s.sectionContent} settings={s.sectionSettings} />
  })
}
