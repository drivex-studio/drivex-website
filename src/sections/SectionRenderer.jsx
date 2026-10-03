import { HeroSection } from '@/sections/homepage/HeroSection'
import { CardsSection } from '@/sections/homepage/CardsSection'
import { LogoSection } from '@/sections/pricingpage/LogoSection'
import { PricingSection } from '@/sections/pricingpage/PricingSection'
import { TableSection } from '@/sections/pricingpage/TableSection'
import { AnimatedListSection } from '@/sections/homepage/AnimatedListSection'
import { FeaturedWorkSection } from '@/sections/homepage/FeaturedWorkSection'
import { IndexedGridSection } from '@/sections/homepage/IndexedGridSection'
import { AccordionSection } from '@/sections/homepage/AccordionSection'
import { ColumnLayoutSection } from '@/sections/ColumnLayoutSection'

import { ContactSection } from '@/sections/ContactSection'
import { TextSection } from '@/sections/TextSection'
import { GallerySection } from '@/sections/GallerySection'
import { MediaSection } from '@/sections/MediaSection'
import { TabsSection } from '@/sections/TabsSection'
import { WorkSliderSection } from '@/sections/workpage/WorkSliderSection'

const sectionMap = {
  heroSectionField: HeroSection,
  cardsSectionField: CardsSection,
  logoSectionField: LogoSection,
  pricingSectionField: PricingSection,
  tableSectionField: TableSection,
  animatedListSectionField: AnimatedListSection,
  featuredWorkSectionField: FeaturedWorkSection,
  indexedGridSectionField: IndexedGridSection,
  accordionSectionField: AccordionSection,
  columnLayoutSectionField: ColumnLayoutSection,

  textSectionField: TextSection,
  tabsSectionField: TabsSection,
  workSliderSectionField: WorkSliderSection,
  gallerySectionField: GallerySection,
  mediaSectionField: MediaSection,
  contactSectionField: ContactSection,
}

export function SectionRenderer({ sections }) {
  return (sections ?? []).map((s) => {
    const Component = sectionMap[s._type]
    if (!Component) return null
    return <Component key={s._key} content={s.sectionContent} settings={s.sectionSettings} />
  })
}