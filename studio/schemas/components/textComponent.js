import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'textComponent',
  title: 'Text Component',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Text Content',
      type: 'array',
      of: [
        { 
          type: 'block',
          marks: {
            annotations: [
              { type: 'linkField' }
            ]
          }
        }
      ] 
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
      blocks: 'text',
      alignment: 'selfAlign'
    },
    prepare(value) {
      const block = (value.blocks || []).find(block => block._type === 'block')
      const textString = block 
        ? block.children.filter(child => child._type === 'span').map(span => span.text).join('')
        : 'Empty Text Component'
        
      return {
        title: textString,
        subtitle: `Alignment: ${value.alignment || 'default'}`
      }
    }
  }
})
