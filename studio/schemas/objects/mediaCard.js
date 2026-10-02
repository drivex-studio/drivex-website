import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'mediaCard',
  title: 'Media Card',
  type: 'object',
  fields: [
    defineField({
      name: 'media',
      title: 'Media',
      type: 'object',
      fields: [
        defineField({
          name: 'type',
          title: 'Media Type',
          type: 'string',
          options: { list: ['image'] },
          initialValue: 'image',
        }),
        defineField({
          name: 'image',
          title: 'Image',
          type: 'image',
          options: { hotspot: true },
        }),
        defineField({
          name: 'aspectRatio',
          title: 'Aspect Ratio',
          type: 'number',
          description: 'Width / height (e.g. 0.75 for 3:4 portrait)',
        }),
        defineField({
          name: 'highResolution',
          title: 'High Resolution',
          type: 'boolean',
          initialValue: false,
        }),
      ],
    }),
    defineField({
      name: 'alt',
      title: 'Alt Text',
      type: 'string',
      description: 'Important for SEO and accessibility.',
    }),
  ],
  preview: {
    select: {
      title: 'alt',
      media: 'media.image',
    },
    prepare({ title, media }) {
      return {
        title: title || 'Media Card',
        subtitle: 'Media Card',
        media,
      }
    },
  },
})
