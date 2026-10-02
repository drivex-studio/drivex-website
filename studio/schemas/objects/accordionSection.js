import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'accordionSection',
  title: 'Accordion Section',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionHeadline',
      title: 'Section Headline',
      type: 'object',
      fields: [
        defineField({
          name: 'level',
          title: 'Heading Level',
          type: 'string',
          options: { list: ['h1', 'h2', 'h3', 'h4'] },
          initialValue: 'h2',
        }),
        defineField({ name: 'text', title: 'Text', type: 'string' }),
      ],
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'headline', title: 'Question', type: 'string' }),
            defineField({
              name: 'text',
              title: 'Answer',
              type: 'array',
              of: [
                {
                  type: 'block',
                  marks: {
                    annotations: [{ type: 'linkField' }],
                  },
                },
              ],
            }),
          ],
          preview: {
            select: { title: 'headline' },
            prepare({ title }) {
              return { title: title || 'Accordion Item' }
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
      initialValue: 'dark',
    }),
  ],
  preview: {
    select: {
      title: 'sectionHeadline.text',
      items: 'items',
    },
    prepare({ title, items }) {
      const count = items ? items.length : 0
      return {
        title: title || 'Accordion Section',
        subtitle: `${count} item${count !== 1 ? 's' : ''}`,
      }
    },
  },
})
