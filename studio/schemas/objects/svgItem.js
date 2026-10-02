
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'svgItem',
  title: 'SVG Logo',
  type: 'object',
  fields: [
    defineField({ name: 'alt', title: 'Alt Text', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'svgCode', title: 'SVG Code', type: 'text', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: { list: ['square', 'horizontal'] },
    }),
  ],
})