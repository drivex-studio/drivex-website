import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'cardsSection',
  title: 'Cards Section',
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
    defineField({ name: 'text', title: 'Text', type: 'text' }),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [{ type: 'mediaCard' }, { type: 'textCard' }],
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
      cards: 'cards',
    },
    prepare({ title, cards }) {
      const count = cards ? cards.length : 0
      return {
        title: title || 'Cards Section',
        subtitle: `${count} card${count !== 1 ? 's' : ''}`,
      }
    },
  },
})
