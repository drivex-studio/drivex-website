import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'textCard',
  title: 'Text Card',
  type: 'object',
  fields: [
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
      name: 'headlineDisplay',
      title: 'Headline Display Size',
      type: 'string',
      options: { list: ['display', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
    }),
    defineField({ name: 'text', title: 'Text', type: 'text', rows: 2 }),
    defineField({
      name: 'cardTheme',
      title: 'Card Theme',
      type: 'string',
      options: {
        list: [
          { title: 'Light', value: 'light' },
          { title: 'Dark', value: 'dark' },
          { title: 'Brand', value: 'brand' },
        ],
        layout: 'radio',
      },
      initialValue: 'light',
    }),
    defineField({
      name: 'plainText',
      title: 'Plain Text',
      type: 'boolean',
      description: 'Show the text as a static paragraph (no scramble / hover effect)',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'headline.text',
      subtitle: 'text',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Text Card',
        subtitle,
      }
    },
  },
})
