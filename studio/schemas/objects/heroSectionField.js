import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'heroSectionField',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({ name: 'sectionContent', title: 'Content', type: 'heroSection' }),
    defineField({
      name: 'sectionSettings',
      title: 'Section Settings',
      type: 'object',
      fields: [
        defineField({ name: 'sectionTitle', title: 'Section Title (internal label)', type: 'string' }),
        defineField({ name: 'customSelector', title: 'Custom Selector', type: 'string' }),
      ],
    }),
  ],
  preview: {
    select: { title: 'sectionContent.headline.text', subtitle: 'sectionSettings.sectionTitle' },
  },
})