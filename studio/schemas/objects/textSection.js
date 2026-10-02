import { defineArrayMember, defineField, defineType } from 'sanity'

const PADDING_OPTIONS = ['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']

export default defineType({
  name: 'textSection',
  title: 'Text Section',
  type: 'object',
  fields: [
    defineField({
      name: 'appRichText',
      title: 'Rich Text',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
            annotations: [{ type: 'linkField' }],
          },
        }),
      ],
    }),
    defineField({
      name: 'theme',
      title: 'Theme',
      type: 'string',
      options: {
        list: [
          { title: 'Light', value: 'light' },
          { title: 'Dark', value: 'dark' },
        ],
        layout: 'radio',
      },
      initialValue: 'light',
    }),
    defineField({
      name: 'paddingTop',
      title: 'Padding Top',
      type: 'string',
      options: { list: PADDING_OPTIONS },
      initialValue: '2xl',
    }),
    defineField({
      name: 'paddingBottom',
      title: 'Padding Bottom',
      type: 'string',
      options: { list: PADDING_OPTIONS },
      initialValue: '2xl',
    }),
  ],
  preview: {
    select: { blocks: 'appRichText' },
    prepare({ blocks }) {
      const first = (blocks || []).find((b) => b._type === 'block')
      const text = first
        ? first.children.filter((c) => c._type === 'span').map((s) => s.text).join('')
        : ''
      return { title: text || 'Text Section', subtitle: 'Text Section' }
    },
  },
})
