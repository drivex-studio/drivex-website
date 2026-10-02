import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'featuredWorkSection',
  title: 'Featured Work Section',
  type: 'object',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'object',
      fields: [
        defineField({
          name: 'level',
          title: 'Heading Level',
          type: 'string',
          options: { list: ['h1', 'h2', 'h3', 'h4'] },
          initialValue: 'h2',
        }),
        defineField({ name: 'text', title: 'Text', type: 'string' }),
      ],
    }),
    defineField({ name: 'text', title: 'Text', type: 'text' }),
    defineField({
      name: 'caseStudies',
      title: 'Case Studies',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'caseStudy' }] }],
    }),
    defineField({
      name: 'viewAllButton',
      title: 'View All Button',
      type: 'button',
    }),
    defineField({
      name: 'theme',
      title: 'Theme',
      type: 'string',
      options: {
        list: [
          { title: 'Light', value: 'light' },
          { title: 'Dark', value: 'dark' },
        ],
        layout: 'radio',
      },
      initialValue: 'dark',
    }),
  ],
  preview: {
    select: {
      title: 'headline.text',
      caseStudies: 'caseStudies',
    },
    prepare({ title, caseStudies }) {
      const count = caseStudies ? caseStudies.length : 0
      return {
        title: title || 'Featured Work Section',
        subtitle: `${count} case stud${count !== 1 ? 'ies' : 'y'}`,
      }
    },
  },
})
