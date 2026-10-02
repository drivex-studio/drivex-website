import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'columnLayoutSectionField',
  title: 'Column Layout Section',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionContent',
      title: 'Column Layout Section Content',
      type: 'columnLayoutSection',
    }),
  ],
  preview: {
    select: {
      title: 'sectionContent.columns.0.components.0.headline.text',
    },
    prepare({ title }) {
      return {
        title: title || 'Column Layout Section',
      }
    },
  },
})
