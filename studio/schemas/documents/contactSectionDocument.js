
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'contactSectionDocument',
  title: 'Contact Section Document',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Internal title for this document (e.g., "Contact")'
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'object',
      fields: [
        defineField({ name: 'text', title: 'Text', type: 'text', rows: 2 }),
        defineField({ 
          name: 'level', 
          title: 'Heading Level', 
          type: 'string',
          options: { 
            list: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
            layout: 'dropdown'
          }
        })
      ]
    }),
    defineField({
      name: 'formHeadline',
      title: 'Form Headline',
      type: 'string',
    }),
    defineField({
      name: 'contactText',
      title: 'Contact Text',
      type: 'array',
      of: [
        {
          type: 'block',
          marks: {
            annotations: [
              { type: 'linkField' } // Reusing your existing linkField for inline links like email and social media
            ]
          }
        }
      ]
    }),
    defineField({
      name: 'ctaButton',
      title: 'CTA Button',
      type: 'linkField', // Reusing linkField object for the "Book a call" button
    }),
    defineField({
      name: 'image',
      title: 'Contact Image',
      type: 'object',
      fields: [
        defineField({
          name: 'type',
          title: 'Type',
          type: 'string',
          initialValue: 'image',
          hidden: true
        }),
        defineField({
          name: 'image',
          title: 'Image',
          type: 'image',
          options: { hotspot: true } // Enables crop and hotspot
        })
      ]
    }),
    
    // ==========================================
    // ASCII Animation Settings
    // ==========================================
    defineField({
      name: 'disableAscii',
      title: 'Disable ASCII Effect',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'asciiImage',
      title: 'ASCII Base Image',
      type: 'image',
      options: { hotspot: true }
    }),
    defineField({
      name: 'asciiDepthMap',
      title: 'ASCII Depth Map Image',
      type: 'image',
      description: 'Image used to calculate 3D depth for the ASCII effect',
      options: { hotspot: true }
    }),
    defineField({
      name: 'asciiCellSize',
      title: 'ASCII Cell Size',
      type: 'number',
    }),
    defineField({
      name: 'asciiColor',
      title: 'ASCII Color (Light Mode)',
      type: 'string',
      description: 'Hex color code (e.g., #ff6b4a)'
    }),
    defineField({
      name: 'asciiColorDark',
      title: 'ASCII Color (Dark Mode)',
      type: 'string',
      description: 'Hex color code (e.g., #4A190A)'
    }),
    defineField({
      name: 'asciiParallaxIntensity',
      title: 'ASCII Parallax Intensity',
      type: 'number',
    }),
    defineField({
      name: 'asciiRevealOriginX',
      title: 'ASCII Reveal Origin X',
      type: 'number',
    }),
    defineField({
      name: 'asciiRevealOriginY',
      title: 'ASCII Reveal Origin Y',
      type: 'number',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'headline.text',
      media: 'image.image'
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'Contact Section',
        subtitle: subtitle,
        media: media
      }
    }
  }
})
