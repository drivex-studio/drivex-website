import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'award',
  title: 'Award',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'awardName',
      title: 'Award Name',
      type: 'string',
      description: 'e.g. "Awwwards SOTD", "GSAP SOTD"',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
    }),
    defineField({
      name: 'caseStudy',
      title: 'Related Case Study',
      type: 'reference',
      to: [{ type: 'caseStudy' }],
    }),
    defineField({
      name: 'caseStudyType',
      title: 'Case Study Type',
      type: 'string',
      options: {
        list: [
          { title: 'Marketing Page', value: 'marketing-page' },
          { title: 'Case Study', value: 'case-study' },
        ],
      },
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'object',
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
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'awardName',
      media: 'image.image',
    },
  },
})
