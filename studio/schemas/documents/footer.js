import {defineArrayMember, defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons/Document'

const plainBlock = defineArrayMember({
  type: 'block',
  styles: [{title: 'Normal', value: 'normal'}],
  marks: {decorators: [], annotations: []},
  lists: [],
})

const linkedBlock = defineArrayMember({
  type: 'block',
  styles: [{title: 'Normal', value: 'normal'}],
  marks: {
    decorators: [],
    annotations: [{type: 'linkField', name: 'linkField'}],
  },
  lists: [],
})

const asciiImageField = (name, title, group) =>
  defineField({
    name,
    title,
    type: 'image',
    group,
    description: 'ASCII-art source image used for the interactive footer visual',
  })

export default defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'ascii', title: 'ASCII Art (Right)'},
    {name: 'asciiLeft', title: 'ASCII Art (Left)'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),

    // Shares menu items / availability / socials / team with the header
    // via reference instead of duplicating the data.
    defineField({
      name: 'navigation',
      title: 'Navigation',
      type: 'reference',
      to: [{type: 'navigation'}],
      group: 'content',
      description: 'Reuses the same navigation document shown in the header (menu items, availability badge, socials, etc.)',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'leftText',
      title: 'Left Text',
      type: 'array',
      group: 'content',
      of: [plainBlock],
    }),
    defineField({
      name: 'contactInformation',
      title: 'Contact Information',
      type: 'array',
      group: 'content',
      description: 'Rich text with inline email / internal links (e.g. contact@..., Privacy Policy, Legal Notice)',
      of: [linkedBlock],
    }),
    defineField({
      name: 'copyrightNotice',
      title: 'Copyright Notice',
      type: 'array',
      group: 'content',
      of: [plainBlock],
    }),
    defineField({
      name: 'showWatermark',
      title: 'Show Watermark',
      type: 'boolean',
      group: 'content',
      initialValue: true,
    }),

    // Right-side ASCII art visual
    asciiImageField('asciiImage', 'ASCII Image', 'ascii'),
    asciiImageField('asciiDepthMap', 'ASCII Depth Map', 'ascii'),
    asciiImageField('asciiMobileFallback', 'ASCII Mobile Fallback', 'ascii'),
    defineField({name: 'asciiColor', title: 'Ascii Color', type: 'string', group: 'ascii'}),
    defineField({name: 'asciiColorDark', title: 'Ascii Color (Dark)', type: 'string', group: 'ascii'}),
    defineField({name: 'asciiCellSize', title: 'Ascii Cell Size', type: 'number', group: 'ascii'}),
    defineField({
      name: 'asciiParallaxIntensity',
      title: 'Ascii Parallax Intensity',
      type: 'number',
      group: 'ascii',
      validation: (Rule) => Rule.min(0).max(1),
    }),
    defineField({
      name: 'asciiRevealOriginX',
      title: 'Ascii Reveal Origin X',
      type: 'number',
      group: 'ascii',
      validation: (Rule) => Rule.min(0).max(1),
    }),
    defineField({
      name: 'asciiRevealOriginY',
      title: 'Ascii Reveal Origin Y',
      type: 'number',
      group: 'ascii',
      validation: (Rule) => Rule.min(0).max(1),
    }),

    asciiImageField('asciiImageLeft', 'ASCII Image (Left)', 'asciiLeft'),
    asciiImageField('asciiDepthMapLeft', 'ASCII Depth Map (Left)', 'asciiLeft'),
    asciiImageField('asciiMobileFallbackLeft', 'ASCII Mobile Fallback (Left)', 'asciiLeft'),
    defineField({name: 'asciiColorLeft', title: 'Ascii Color (Left)', type: 'string', group: 'asciiLeft'}),
    defineField({name: 'asciiColorDarkLeft', title: 'Ascii Color Dark (Left)', type: 'string', group: 'asciiLeft'}),
    defineField({name: 'asciiCellSizeLeft', title: 'Ascii Cell Size (Left)', type: 'number', group: 'asciiLeft'}),
    defineField({
      name: 'asciiParallaxIntensityLeft',
      title: 'Ascii Parallax Intensity (Left)',
      type: 'number',
      group: 'asciiLeft',
      validation: (Rule) => Rule.min(0).max(1),
    }),
    defineField({
      name: 'asciiRevealOriginXLeft',
      title: 'Ascii Reveal Origin X (Left)',
      type: 'number',
      group: 'asciiLeft',
      validation: (Rule) => Rule.min(0).max(1),
    }),
    defineField({
      name: 'asciiRevealOriginYLeft',
      title: 'Ascii Reveal Origin Y (Left)',
      type: 'number',
      group: 'asciiLeft',
      validation: (Rule) => Rule.min(0).max(1),
    }),
  ],
  preview: {
    select: {title: 'title'},
  },
})
