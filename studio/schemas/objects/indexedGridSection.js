import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'indexedGridSection',
  title: 'Indexed Grid Section',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Eyebrow Text',
      type: 'string',
      description: 'Small text shown above the headline, e.g. "// The build"',
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
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
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'Supporting line, e.g. "Every landmark, the same standard."',
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [{ type: 'gridItem' }],
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
      title: 'headline.text',
      items: 'items',
    },
    prepare({ title, items }) {
      const count = items ? items.length : 0
      return {
        title: title || 'Indexed Grid Section',
        subtitle: `${count} item${count !== 1 ? 's' : ''}`,
      }
    },
  },
})
