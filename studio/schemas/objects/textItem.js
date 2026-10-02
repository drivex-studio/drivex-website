import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'textItem',
  title: 'Text Item',
  type: 'object',
  fields: [
    defineField({ name: 'text', title: 'Text', type: 'string' }),
  ],
})