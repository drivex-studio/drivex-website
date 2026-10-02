import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'textSectionField',
  title: 'Text Section',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionContent',
      title: 'Text Section Content',
      type: 'textSection',
    }),
    defineField({
      name: 'sectionSettings',
      title: 'Section Settings',
      type: 'object',
      fields: [
        defineField({ name: 'sectionTitle', title: 'Section Title (internal label)', type: 'string' }),
        defineField({
          name: 'customSelector',
          title: 'Custom Selector',
          type: 'string',
          description: 'CSS class hook used by the front end, e.g. "text-narrow"',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'sectionSettings.sectionTitle',
      subtitle: 'sectionContent.appRichText.0.children.0.text',
    },
    prepare({ title, subtitle }) {
      return { title: title || 'Text Section', subtitle }
    },
  },
})
