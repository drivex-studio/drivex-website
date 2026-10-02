import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'notFound',
  title: 'Not Found Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      description: 'For identifying this document in the Studio only'
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string'
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3
    }),
    defineField({
      name: 'asciiImage',
      title: 'ASCII Image (Desktop)',
      type: 'image',
      options: { hotspot: true }
    }),
    defineField({
      name: 'asciiMobileImage',
      title: 'ASCII Image (Mobile)',
      type: 'image',
      options: { hotspot: true }
    }),
    defineField({
      name: 'asciiDepthMap',
      title: 'ASCII Depth Map',
      type: 'image',
      options: { hotspot: true }
    }),
    defineField({
      name: 'asciiColor',
      title: 'ASCII Color (Light)',
      type: 'string',
      description: 'Hex color, e.g. #ff6b4a'
    }),
    defineField({
      name: 'asciiColorDark',
      title: 'ASCII Color (Dark)',
      type: 'string',
      description: 'Hex color, e.g. #4A190A'
    }),
    defineField({
      name: 'asciiCellSize',
      title: 'ASCII Cell Size',
      type: 'number'
    }),
    defineField({
      name: 'asciiParallaxIntensity',
      title: 'ASCII Parallax Intensity',
      type: 'number'
    }),
    defineField({
      name: 'asciiRevealOriginX',
      title: 'ASCII Reveal Origin X',
      type: 'number',
      description: 'Value between 0 and 1'
    }),
    defineField({
      name: 'asciiRevealOriginY',
      title: 'ASCII Reveal Origin Y',
      type: 'number',
      description: 'Value between 0 and 1'
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'headline'
    }
  }
})
