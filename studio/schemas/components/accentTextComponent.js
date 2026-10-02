import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'accentTextComponent',
  title: 'Accent Text Component',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'color',
      title: 'Color Theme',
      type: 'string',
      options: {
        list: [
          { title: 'Foreground', value: 'foreground' },
          { title: 'Brand/Accent', value: 'brand' },
          { title: 'Muted', value: 'muted' }
        ],
        layout: 'dropdown'
      },
      initialValue: 'foreground'
    }),
    defineField({
      name: 'style',
      title: 'Text Style',
      type: 'string',
      options: {
        list: [
          { title: 'Small', value: 'small' },
          { title: 'Default', value: 'default' },
          { title: 'Large', value: 'large' }
        ],
        layout: 'dropdown'
      },
      initialValue: 'small'
    })
  ],
  preview: {
    select: {
      title: 'text',
      color: 'color',
      style: 'style'
    },
    prepare({ title, color, style }) {
      return {
        title: title || 'Empty Accent Text',
        subtitle: `Color: ${color || 'default'} | Style: ${style || 'default'}`
      }
    }
  }
})
