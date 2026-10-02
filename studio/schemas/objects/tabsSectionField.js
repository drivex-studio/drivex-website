import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'tabsSectionField',
  title: 'Tabs Section',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionContent',
      title: 'Tabs Section Content',
      type: 'tabsSection',
    }),
  ],
  preview: {
    select: { title: 'sectionContent.sectionHeadline.text' },
    prepare({ title }) {
      return { title: title || 'Tabs Section' }
    },
  },
})
