import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'button',
  title: 'Button',
  type: 'object',
  fields: [
    defineField({ name: 'link', title: 'Link', type: 'linkField' }),
    defineField({
      name: 'size',
      title: 'Size',
      type: 'string',
      options: { list: ['sm', 'default'] },
    }),
    defineField({
      name: 'theme',
      title: 'Theme',
      type: 'string',
      options: { list: ['light', 'dark', 'brand'] },
    }),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: { list: ['button', 'link'] },
    }),
  ],
})