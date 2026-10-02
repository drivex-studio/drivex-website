import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'imageComponent',
  title: 'Image Component',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image Source',
      type: 'object',
      fields: [
        defineField({
          name: 'type',
          title: 'Media Type',
          type: 'string',
          initialValue: 'image',
          hidden: true
        }),
        defineField({
          name: 'image', 
          title: 'Upload Image',
          type: 'image',
          options: {
            hotspot: true 
          },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alternative Text',
              type: 'string',
              description: 'Important for SEO and accessibility.',
            })
          ]
        })
      ]
    }),
    defineField({
      name: 'aspectRatio',
      title: 'Aspect Ratio',
      type: 'string',
      options: {
        list: [
          { title: 'Auto (Original)', value: 'auto' },
          { title: 'Square (1:1)', value: '1/1' },
          { title: 'Portrait (3:4)', value: '3/4' },
          { title: 'Landscape (4:3)', value: '4/3' },
          { title: 'Wide (3:2)', value: '3/2' },
          { title: 'Ultrawide (16:9)', value: '16/9' }
        ],
        layout: 'dropdown'
      },
      initialValue: 'auto'
    })
  ],
  preview: {
    select: {
      media: 'image.image',
      ratio: 'aspectRatio'
    },
    prepare({ media, ratio }) {
      return {
        title: 'Image Component',
        subtitle: `Ratio: ${ratio || 'auto'}`,
        media: media
      }
    }
  }
})
