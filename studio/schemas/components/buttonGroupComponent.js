// schemas/objects/buttonGroupComponent.js
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'buttonGroupComponent',
  title: 'Button Group Component',
  type: 'object',
  fields: [
    defineField({
      name: 'buttonGroup',
      title: 'Button Group Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'layout',
          title: 'Layout Direction',
          type: 'string',
          options: {
            list: [
              { title: 'Horizontal', value: 'horizontal' },
              { title: 'Vertical', value: 'vertical' },
            ],
            layout: 'radio'
          },
          initialValue: 'horizontal'
        }),
        defineField({
          name: 'gap',
          title: 'Gap',
          type: 'string',
          description: 'Spacing between buttons (e.g., "16")',
          initialValue: '16'
        }),
        defineField({
          name: 'buttons',
          title: 'Buttons',
          type: 'array',
          of: [{ type: 'button' }] 
        })
      ]
    })
  ],
  preview: {
    select: {
      layout: 'buttonGroup.layout',
      buttons: 'buttonGroup.buttons'
    },
    prepare({ layout, buttons }) {
      const count = buttons ? buttons.length : 0
      return {
        title: `Button Group (${count} button${count !== 1 ? 's' : ''})`,
        subtitle: `Layout: ${layout || 'horizontal'}`
      }
    }
  }
})
