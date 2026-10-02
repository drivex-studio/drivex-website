
import { defineField, defineType } from 'sanity'

const PADDING_OPTIONS = ['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']

export default defineType({
  name: 'heroSection',
  title: 'Hero Section',
  type: 'object',
  fields: [
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: { list: ['textOnly', 'media', 'parallax', 'ascii'] },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'theme',
      title: 'Theme',
      type: 'string',
      options: { list: ['light', 'dark'] },
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'object',
      fields: [
        defineField({ name: 'level', title: 'Level', type: 'string', options: { list: ['h1', 'h2'] } }),
        defineField({ name: 'text', title: 'Text', type: 'text' }),
      ],
    }),
    defineField({
      name: 'headlineDisplay',
      title: 'Headline Display Size',
      type: 'string',
      options: { list: ['h1', 'h2'] },
    }),
    defineField({ name: 'subtext', title: 'Subtext', type: 'text' }),
    defineField({ name: 'paddingTop', title: 'Padding Top', type: 'string', options: { list: PADDING_OPTIONS } }),
    defineField({ name: 'paddingBottom', title: 'Padding Bottom', type: 'string', options: { list: PADDING_OPTIONS } }),

    // CTAs (used in media/ascii/textOnly variants)
    defineField({
      name: 'ctas',
      title: 'CTAs',
      type: 'object',
      fields: [
        defineField({ name: 'buttons', title: 'Buttons', type: 'array', of: [{ type: 'button' }] }),
        defineField({ name: 'gap', title: 'Gap', type: 'string' }),
        defineField({ name: 'layout', title: 'Layout', type: 'string', options: { list: ['horizontal', 'vertical'] } }),
      ],
    }),

    defineField({ name: 'trustedBy', title: 'Trusted By', type: 'trustedBy' }),

    // Media variant fields
    defineField({
      name: 'heroMedia',
      title: 'Hero Media',
      type: 'object',
      fields: [
        defineField({ name: 'aspectRatio', title: 'Aspect Ratio', type: 'number' }),
        defineField({ name: 'externalVideoUrl', title: 'External Video URL', type: 'url' }),
        defineField({ name: 'type', title: 'Type', type: 'string', options: { list: ['externalVideo', 'image'] } }),
        defineField({
          name: 'videoOptions',
          title: 'Video Options',
          type: 'object',
          fields: [
            defineField({ name: 'autoPlay', title: 'Autoplay', type: 'boolean' }),
            defineField({ name: 'loop', title: 'Loop', type: 'boolean' }),
            defineField({ name: 'muted', title: 'Muted', type: 'boolean' }),
          ],
        }),
      ],
    }),
    
    defineField({ name: 'asciiCellSize', title: 'ASCII Cell Size', type: 'number' }),
    defineField({ name: 'asciiColor', title: 'ASCII Color', type: 'string' }),
    defineField({ name: 'asciiColorDark', title: 'ASCII Color (Dark)', type: 'string' }),
    defineField({ name: 'asciiImage', title: 'ASCII Image', type: 'image' }),
    defineField({ name: 'asciiOriginalImage', title: 'ASCII Original Image', type: 'image' }),
    defineField({ name: 'asciiRevealOriginX', title: 'ASCII Reveal Origin X', type: 'number' }),
    defineField({ name: 'asciiRevealOriginY', title: 'ASCII Reveal Origin Y', type: 'number' }),
    defineField({ name: 'depthMap', title: 'Depth Map', type: 'image' }),
    defineField({ name: 'parallaxIntensity', title: 'Parallax Intensity', type: 'number' }),
    defineField({ name: 'enableStretch', title: 'Enable Stretch', type: 'boolean' }),
    defineField({ name: 'stretchIntensity', title: 'Stretch Intensity', type: 'number' }),
    defineField({
      name: 'parallaxMedia',
      title: 'Parallax Media',
      type: 'object',
      fields: [
        defineField({ name: 'image', title: 'Image', type: 'image' }),
        defineField({ name: 'highResolution', title: 'High Resolution', type: 'boolean' }),
      ],
    }),
    defineField({ name: 'parallaxMobileImage', title: 'Parallax Mobile Image', type: 'image' }),
    defineField({ name: 'scrollText', title: 'Scroll Text', type: 'string' }),
    defineField({ name: 'showScrollText', title: 'Show Scroll Text', type: 'boolean' }),
    defineField({ name: 'useWatermark', title: 'Use Watermark', type: 'boolean' }),
  ],
})