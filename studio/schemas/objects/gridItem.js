import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'gridItem',
  title: 'Grid Item',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({
      name: 'caseStudy',
      title: 'Case Study',
      type: 'reference',
      to: [{ type: 'caseStudy' }],
      description: 'Optional. Shows a related case study alongside this item.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Grid Item',
        subtitle,
      }
    },
  },
})
