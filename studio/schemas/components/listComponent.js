import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'listComponent',
  title: 'List Component',
  type: 'object',
  fields: [
    defineField({ name: 'animated', type: 'boolean', initialValue: false }),
    defineField({ name: 'pushEffect', type: 'boolean', initialValue: false }),
    defineField({
      name: 'items',
      type: 'array',
      of: [
        defineField({
          name: 'listItem',
          type: 'object',
          fields: [
            defineField({ name: 'text', type: 'string' }),
            defineField({ name: 'isHighlighted', type: 'boolean', initialValue: false })
          ]
        })
      ]
    })
  ]
})
