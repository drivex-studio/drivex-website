import {defineField, defineType} from 'sanity'
import {StarIcon} from '@sanity/icons/Star'

export default defineType({
  name: 'flyoutFeaturedProject',
  title: 'Flyout Featured Project',
  type: 'object',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
    defineField({
      name: 'project',
      title: 'Project',
      type: 'reference',
      to: [{type: 'project'}],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'caption',
      subtitle: 'project.title',
    },
  },
})
