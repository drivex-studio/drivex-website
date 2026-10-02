
import { defineArrayMember, defineField, defineType } from 'sanity'

const PADDING_OPTIONS = ['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']

export default defineType({
  name: 'tabsSection',
  title: 'Tabs Section',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionHeadline',
      title: 'Section Headline',
      type: 'object',
      fields: [
        defineField({
          name: 'level',
          title: 'Heading Level',
          type: 'string',
          options: { list: ['h1', 'h2', 'h3', 'h4'] },
          initialValue: 'h2',
        }),
        defineField({ name: 'text', title: 'Text', type: 'string' }),
      ],
    }),
    defineField({
      name: 'items',
      title: 'Tabs',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          title: 'Tab',
          fields: [
            defineField({
              name: 'headline',
              title: 'Tab Label',
              type: 'string',
              description: 'e.g. "Deutsch", "English"',
            }),
            defineField({
              name: 'text',
              title: 'Content',
              type: 'array',
              description: 'Shift+Enter inserts a line break inside the same paragraph.',
              of: [
                defineArrayMember({
                  type: 'block',
                  styles: [{ title: 'Normal', value: 'normal' }],
                  lists: [],
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
          ],
          preview: {
            select: { title: 'headline' },
            prepare({ title }) {
              return { title: title || 'Tab' }
            },
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
      initialValue: 'xl',
    }),
    defineField({
      name: 'paddingBottom',
      title: 'Padding Bottom',
      type: 'string',
      options: { list: PADDING_OPTIONS },
      initialValue: 'xl',
    }),
  ],
  preview: {
    select: { title: 'sectionHeadline.text', items: 'items' },
    prepare({ title, items }) {
      const count = items ? items.length : 0
      return {
        title: title || 'Tabs Section',
        subtitle: `${count} tab${count !== 1 ? 's' : ''}`,
      }
    },
  },
})
