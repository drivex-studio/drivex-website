import {defineField, defineType} from 'sanity'
import {ShareIcon} from '@sanity/icons/Share'

export default defineType({
  name: 'socialLink',
  title: 'Social Link',
  type: 'object',
  icon: ShareIcon,
  fields: [
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: {
        list: [
          {title: 'Instagram', value: 'Instagram'},
          {title: 'LinkedIn', value: 'LinkedIn'},
          {title: 'Github', value: 'Github'},
          {title: 'X / Twitter', value: 'Twitter'},
          {title: 'Behance', value: 'Behance'},
          {title: 'Dribbble', value: 'Dribbble'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'handle',
      title: 'Handle',
      type: 'string',
      description: 'e.g. @good_fella_studio',
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule) => Rule.required().uri({scheme: ['http', 'https']}),
    }),
  ],
  preview: {
    select: {
      title: 'platform',
      subtitle: 'handle',
    },
  },
})
