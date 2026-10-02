import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'featuredWorkSectionField',
  title: 'Featured Work Section',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionContent',
      title: 'Featured Work Section Content',
      type: 'featuredWorkSection',
    }),
  ],
  preview: {
    select: {
      title: 'sectionContent.headline.text',
    },
    prepare({ title }) {
      return {
        title: title || 'Featured Work Section',
      }
    },
  },
})
