import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'dividerComponent',
  title: 'Divider Component',
  type: 'object',
  fields: [
    defineField({
      name: 'orientation',
      title: 'Orientation',
      type: 'string',
      options: {
        list: [
          { title: 'Horizontal', value: 'horizontal' },
          { title: 'Vertical', value: 'vertical' },
        ],
      },
      initialValue: 'horizontal',
    }),
    defineField({
      name: 'paddingTop',
      title: 'Padding Top',
      type: 'string',
      options: { list: ['none', 'xs', 'sm', 'md', 'lg', 'xl'] },
    }),
    defineField({
      name: 'paddingBottom',
      title: 'Padding Bottom',
      type: 'string',
      options: { list: ['none', 'xs', 'sm', 'md', 'lg', 'xl'] },
    }),
  ],
  preview: {
    select: { orientation: 'orientation' },
    prepare({ orientation }) {
      return { title: `Divider (${orientation || 'horizontal'})` }
    },
  },
})
