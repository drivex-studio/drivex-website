import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'indexedGridSectionField',
  title: 'Indexed Grid Section',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionContent',
      title: 'Indexed Grid Section Content',
      type: 'indexedGridSection',
    }),
  ],
  preview: {
    select: {
      title: 'sectionContent.headline.text',
    },
    prepare({ title }) {
      return {
        title: title || 'Indexed Grid Section',
      }
    },
  },
})
