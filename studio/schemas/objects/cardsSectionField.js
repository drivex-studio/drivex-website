import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'cardsSectionField',
  title: 'Cards Section',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionContent',
      title: 'Cards Section Content',
      type: 'cardsSection',
    }),
  ],
  preview: {
    select: {
      title: 'sectionContent.headline.text',
    },
    prepare({ title }) {
      return {
        title: title || 'Cards Section',
      }
    },
  },
})
