import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'landingPage',
  title: 'Landing Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'uri',
      title: 'URI',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Page Builder',
      type: 'object',
      fields: [
        defineField({
          name: 'sectionsArray',
          title: 'Sections',
          type: 'array',
          of: [
            { type: 'heroSectionField' },
            { type: 'logoSectionField' },
            // { type: 'cardsSectionField' },
            // { type: 'columnLayoutSectionField' },
            // { type: 'indexedGridSectionField' },
            // { type: 'animatedListSectionField' },
            // { type: 'tableSectionField' },
            // { type: 'pricingSectionField' },
            // { type: 'accordionSectionField' },
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'uri.current',
    },
  },
})
