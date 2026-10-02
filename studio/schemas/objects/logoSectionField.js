import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'logoSectionField',
  title: 'Logo Section',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionContent',
      title: 'Logo Section Content',
      type: 'logoSection',
    }),
  ],
  preview: {
    select: {
      title: 'sectionContent.trustedBy.title',
    },
    prepare({ title }) {
      return {
        title: title || 'Logo Section',
      }
    },
  },
})
