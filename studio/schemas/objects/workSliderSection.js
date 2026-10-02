import { defineField, defineType } from 'sanity'

const PADDING_OPTIONS = ['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']

export default defineType({
  name: 'workSliderSection',
  title: 'Work Slider Section',
  type: 'object',
  fields: [
    defineField({
      name: 'featuredItems',
      title: 'Featured Items',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'caseStudy' }] }],
    }),
    defineField({
      name: 'filterLabel',
      title: 'Filter Label',
      type: 'string',
      initialValue: 'FILTER',
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
      initialValue: 'none',
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
    select: { items: 'featuredItems' },
    prepare({ items }) {
      const count = items ? items.length : 0
      return {
        title: 'Work Slider Section',
        subtitle: `${count} item${count !== 1 ? 's' : ''}`,
      }
    },
  },
})
