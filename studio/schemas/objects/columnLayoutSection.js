import { defineField, defineType } from 'sanity'

const COMPONENTS = [
  { type: 'headlineComponent' },
  { type: 'textComponent' },
  { type: 'imageComponent' },
  { type: 'buttonComponent' },
  { type: 'buttonGroupComponent' },
  { type: 'accentTextComponent' },
  { type: 'sectionHeaderComponent' },
  { type: 'listComponent' },
  { type: 'dividerComponent' },
]

export default defineType({
  name: 'columnLayoutSection',
  title: 'Column Layout Section',
  type: 'object',
  fields: [
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'array',
      of: [
        {
          type: 'object',
          title: 'Column',
          fields: [
            defineField({
              name: 'columnStart',
              title: 'Column Start',
              type: 'number',
              description: 'Grid column the block starts on (1-12)',
              validation: (Rule) => Rule.min(1).max(12).integer(),
            }),
            defineField({
              name: 'columnSpan',
              title: 'Column Span',
              type: 'number',
              description: 'Number of grid columns the block spans (1-12)',
              validation: (Rule) => Rule.min(1).max(12).integer(),
            }),
            defineField({
              name: 'horizontalAlignment',
              title: 'Horizontal Alignment',
              type: 'string',
              options: {
                list: [
                  { title: 'Start', value: 'start' },
                  { title: 'Center', value: 'center' },
                  { title: 'End', value: 'end' },
                ],
                layout: 'dropdown',
              },
              initialValue: 'start',
            }),
            defineField({
              name: 'verticalAlignment',
              title: 'Vertical Alignment',
              type: 'string',
              options: {
                list: [
                  { title: 'Start', value: 'start' },
                  { title: 'Center', value: 'center' },
                  { title: 'End', value: 'end' },
                  { title: 'Space Between', value: 'between' },
                ],
                layout: 'dropdown',
              },
              initialValue: 'start',
            }),
            defineField({
              name: 'spaceBetween',
              title: 'Space Between Components',
              type: 'string',
              description: 'Spacing between components (e.g., "16", "80")',
              initialValue: '16',
            }),
            defineField({
              name: 'components',
              title: 'Components',
              type: 'array',
              of: COMPONENTS,
            }),
          ],
          preview: {
            select: {
              start: 'columnStart',
              span: 'columnSpan',
              components: 'components',
            },
            prepare({ start, span, components }) {
              const count = components ? components.length : 0
              return {
                title: `Column (start ${start ?? '-'}, span ${span ?? '-'})`,
                subtitle: `${count} component${count !== 1 ? 's' : ''}`,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'theme',
      title: 'Theme',
      type: 'string',
      options: {
        list: [
          { title: 'Light', value: 'light' },
          { title: 'Dark', value: 'dark' },
        ],
        layout: 'radio',
      },
      initialValue: 'light',
    }),
  ],
  preview: {
    select: {
      columns: 'columns',
    },
    prepare({ columns }) {
      const count = columns ? columns.length : 0
      return {
        title: 'Column Layout Section',
        subtitle: `${count} column${count !== 1 ? 's' : ''}`,
      }
    },
  },
})
