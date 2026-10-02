
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'buttonComponent',
  title: 'Button Component',
  type: 'object',
  fields: [
    defineField({
      name: 'button',
      title: 'Button Settings',
      type: 'button', 
    }),
    defineField({
      name: 'selfAlign',
      title: 'Self Alignment',
      type: 'string',
      options: {
        list: [
          { title: 'Default', value: 'default' },
          { title: 'Top', value: 'top' },
          { title: 'Bottom', value: 'bottom' },
          { title: 'Center', value: 'center' }
        ],
        layout: 'dropdown'
      },
      initialValue: 'default'
    })
  ],
  preview: {
    select: {
      buttonText: 'button.link.customText',
      align: 'selfAlign'
    },
    prepare({ buttonText, align }) {
      return {
        title: buttonText || 'Button',
        subtitle: `Alignment: ${align || 'default'}`
      }
    }
  }
})
