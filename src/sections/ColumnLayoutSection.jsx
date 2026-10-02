import { ColumnLayoutSectionClient } from '@/sections/shared/ColumnLayoutSectionClient'

export function ColumnLayoutSection({ content }) {
  if (!content?.columns?.length) return null

  return (
    <section
      data-page-builder-section="true"
      data-theme={content.theme}
      className="pt-64 lg:pt-128 pb-64 lg:pb-128 bg-background"
    >
      <ColumnLayoutSectionClient columns={content.columns} />
    </section>
  )
}
