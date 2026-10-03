
import { LogoSectionContent } from '@/sections/contents/LogoSectionContent'

const SECTION_CLASS_NAME = 'bg-background pt-48 lg:pt-96 pb-16 lg:pb-32'

export function LogoSection({ content }) {
  if (!content?.trustedBy?.items?.length) return null

  const theme = content.theme ?? 'light'
  return (
    <section
      data-theme={theme}
      data-page-builder-section="logoSection"
      className={SECTION_CLASS_NAME}
    >
      <LogoSectionContent trustedBy={content.trustedBy} theme={theme} />
    </section>
  )
}