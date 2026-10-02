import {defineField, defineType} from 'sanity'
import {ImageIcon} from '@sanity/icons/Image'

export default defineType({
  name: 'flyoutCenterImage',
  title: 'Flyout Center Image',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'linkField',
    }),
  ],
  preview: {
    select: {
      title: 'caption',
      media: 'image',
    },
  },
})
