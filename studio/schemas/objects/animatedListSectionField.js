import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'animatedListSectionField',
  title: 'Animated List Section',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionContent',
      title: 'Animated List Section Content',
      type: 'animatedListSection',
    }),
  ],
  preview: {
    select: {
      title: 'sectionContent.headline.text',
    },
    prepare({ title }) {
      return {
        title: title || 'Animated List Section',
      }
    },
  },
})
