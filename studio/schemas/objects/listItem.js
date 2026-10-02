import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'listItem',
  title: 'List Item',
  type: 'object',
  fields: [
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({ name: 'text', title: 'Text', type: 'text', rows: 3 }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          description: 'Important for SEO and accessibility.',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'headline',
      subtitle: 'text',
      media: 'image',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'List Item',
        subtitle,
        media,
      }
    },
  },
})
