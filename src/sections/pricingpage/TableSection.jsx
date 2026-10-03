import { TableSectionClient } from '@/sections/shared/TableSectionClient'

const SECTION_CLASS_NAME = 'bg-background pt-64 lg:pt-128 pb-64 lg:pb-128'

export function TableSection({ content }) {
  if (!content?.columns?.length || !content?.rows?.length) return null

  const { theme, headline, text, button, columns, rows } = content

  return (
    <section
      data-theme={theme}
      data-page-builder-section="tableSection"
      className={SECTION_CLASS_NAME}
    >
      <TableSectionClient
        headline={headline}
        text={text?.length ? text : undefined}
        button={button}
        columns={columns}
        rows={rows.map((row) => ({ ...row, values: row.values ?? [] }))}
        tableTheme="dark"
        hasHighlightedColumn={columns.some((col) => col.highlight)}
      />
    </section>
  )
}