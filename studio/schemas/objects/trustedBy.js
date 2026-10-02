import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'trustedBy',
  title: 'Trusted By',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [{ type: 'svgItem' }, { type: 'textItem' }],
    }),
  ],
})