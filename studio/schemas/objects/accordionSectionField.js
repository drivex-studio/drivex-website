import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'accordionSectionField',
  title: 'Accordion Section',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionContent',
      title: 'Accordion Section Content',
      type: 'accordionSection',
    }),
  ],
  preview: {
    select: {
      title: 'sectionContent.sectionHeadline.text',
    },
    prepare({ title }) {
      return {
        title: title || 'Accordion Section',
      }
    },
  },
})
