import {defineField, defineType} from 'sanity'
import {MenuIcon} from '@sanity/icons/Menu'

export default defineType({
  name: 'navigationItem',
  title: 'Navigation Item',
  type: 'object',
  icon: MenuIcon,
  fields: [
    defineField({
      name: 'text',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'navigationItemUrl',
      title: 'Link',
      type: 'linkField',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'text',
      subtitle: 'navigationItemUrl.type',
    },
  },
})
