import { defineField, defineType } from 'sanity'
import { DocumentIcon } from '@sanity/icons/Document'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
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
            { type: 'cardsSectionField' },
            { type: 'animatedListSectionField' },
            { type: 'featuredWorkSectionField' },
            { type: 'indexedGridSectionField' },
            { type: 'accordionSectionField' },
            { type: 'columnLayoutSectionField' },
          ],
        }),
      ],
    }),
    defineField({
      name: 'seoMetadata',
      title: 'SEO Metadata',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'SEO Title', type: 'string' }),
        defineField({ name: 'description', title: 'SEO Description', type: 'text' }),
        defineField({ name: 'noIndex', title: 'No Index', type: 'boolean' }),
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