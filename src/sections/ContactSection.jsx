import { cx } from '@/libs/utils/className'
import { ScrollAnimatedHeadline } from '@/components/animations/ScrollAnimatedHeadline'
import { SanityRichText } from '@/components/sanity/SanityRichText'
import { SanityMedia } from '@/components/sanity/SanityMedia'
import { SanityLink } from '@/components/sanity/SanityLink'
import { ContactFormClient } from '@/sections/shared/ContactFormClient'

const PADDING_TOP = {
  none: 'pt-0',
  sm: 'pt-16 lg:pt-32',
  md: 'pt-32 lg:pt-64',
  lg: 'pt-48 lg:pt-96',
  xl: 'pt-64 lg:pt-128',
  '2xl': 'pt-80 lg:pt-160',
  '3xl': 'pt-96 lg:pt-192',
}

const PADDING_BOTTOM = {
  none: 'pb-0',
  sm: 'pb-16 lg:pb-32',
  md: 'pb-32 lg:pb-64',
  lg: 'pb-48 lg:pb-96',
  xl: 'pb-64 lg:pb-128',
  '2xl': 'pb-80 lg:pb-160',
  '3xl': 'pb-96 lg:pb-192',
}

export function ContactSection({ content, settings }) {
  const contact = content?.contact
  if (!contact) return null

  const { headline, contactText, ctaButton, formHeadline, image } = contact

  return (
    <section
      id={settings?.sectionId}
      data-page-builder-section={true}
      data-theme={content.theme}
      data-selector={settings?.customSelector}
      className={cx(
        'bg-background',
        PADDING_TOP[content.paddingTop] ?? PADDING_TOP.none,
        PADDING_BOTTOM[content.paddingBottom] ?? PADDING_BOTTOM.none
      )}
    >
      <div className="grid-container flex items-center py-header lg:min-h-svh">
        <div className="grid-layout !gap-y-64 items-center lg:min-h-750">
          {/* Image */}
          <div className="grid-span-12 lg:grid-span-4 order-3 h-full lg:order-none">
            <div className="size-full overflow-hidden">
              {image?.image && (
                <SanityMedia media={image} className="size-full object-cover" />
              )}
            </div>
          </div>

          {/* Headline + contact details */}
          <div className="grid-span-12 lg:grid-span-2 lg:grid-start-6 flex h-full flex-col justify-between">
            <ScrollAnimatedHeadline headline={headline} />
            {contactText?.length > 0 && (
              <div className="prose prose-sm mt-auto text-body-sm text-foreground/60">
                <SanityRichText value={contactText} />
              </div>
            )}
          </div>

          {/* Book a call + form */}
          <div className="grid-span-12 lg:grid-span-5 lg:grid-start-9 flex h-full flex-col justify-between">
            <div className="mb-48">
              {formHeadline && <h3 className="mb-24 text-h4">{formHeadline}</h3>}
              {ctaButton?.href && (
                <SanityLink link={ctaButton} animated theme="brand">
                  {ctaButton.text}
                </SanityLink>
              )}
            </div>
            <div>
              <h3 className="mb-32 text-h4">Send a message</h3>
              <ContactFormClient />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
