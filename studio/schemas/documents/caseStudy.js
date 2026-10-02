import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'info', title: 'Project Info' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'title' },
    }),
    defineField({
      name: 'uri',
      title: 'URI',
      type: 'slug',
      group: 'content',
      description: 'Full route, e.g. /work/fitgreenmind',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'object',
      group: 'content',
      fields: [
        defineField({
          name: 'type',
          title: 'Media Type',
          type: 'string',
          options: { list: ['image', 'video', 'externalVideo'] },
          initialValue: 'image',
        }),
        defineField({
          name: 'image',
          title: 'Image',
          type: 'image',
          options: { hotspot: true },
        }),
        defineField({
          name: 'externalVideoUrl',
          title: 'External Video URL',
          type: 'url',
          hidden: ({ parent }) => parent?.type !== 'externalVideo',
        }),
        defineField({
          name: 'highResolution',
          title: 'High Resolution',
          type: 'boolean',
          initialValue: false,
        }),
      ],
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Page Builder',
      type: 'object',
      group: 'content',
      fields: [
        defineField({
          name: 'sectionsArray',
          title: 'Sections',
          type: 'array',
          of: [
            { type: 'heroSectionField' },
            // ⬇ schema ရေးပြီးမှ uncomment ပါ
            // { type: 'columnLayoutSectionField' },
            // { type: 'gallerySectionField' },
            // { type: 'mediaSectionField' },
          ],
        }),
      ],
    }),
    defineField({
      name: 'projectInfo',
      title: 'Project Info',
      type: 'object',
      group: 'info',
      fields: [
        defineField({
          name: 'projectTitle',
          title: 'Project Title',
          type: 'object',
          fields: [
            defineField({ name: 'level', type: 'string', options: { list: ['h1', 'h2', 'h3', 'h4'] } }),
            defineField({ name: 'text', type: 'string' }),
          ],
        }),
        defineField({
          name: 'projectUrl',
          title: 'Project URL',
          type: 'url',
        }),
        defineField({
          name: 'stats',
          title: 'Stats',
          type: 'object',
          fields: [
            defineField({ name: 'location', title: 'Location', type: 'string' }),
            defineField({
              name: 'techStack',
              title: 'Tech Stack',
              type: 'array',
              of: [{ type: 'string' }],
            }),
            defineField({ name: 'timeline', title: 'Timeline', type: 'string' }),
            defineField({ name: 'year', title: 'Year', type: 'string' }),
          ],
        }),
        defineField({
          name: 'teaserHeadline',
          title: 'Teaser Headline',
          type: 'object',
          fields: [
            defineField({ name: 'level', type: 'string', options: { list: ['h1', 'h2', 'h3', 'h4'] } }),
            defineField({ name: 'text', type: 'string' }),
          ],
        }),
        defineField({
          name: 'teaserText',
          title: 'Teaser Text',
          type: 'text',
        }),
      ],
    }),
    defineField({
      name: 'relatedWorks',
      title: 'Related Works',
      type: 'array',
      group: 'info',
      of: [{ type: 'reference', to: [{ type: 'caseStudy' }] }],
    }),
    defineField({
      name: 'seoMetadata',
      title: 'SEO Metadata',
      type: 'object',
      group: 'seo',
      fields: [
        defineField({ name: 'title', title: 'SEO Title', type: 'string' }),
        defineField({ name: 'description', title: 'SEO Description', type: 'text' }),
        defineField({ name: 'noIndex', title: 'No Index', type: 'boolean', initialValue: false }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'uri.current',
      media: 'mainImage.image',
    },
  },
})
