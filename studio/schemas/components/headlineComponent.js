import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'headlineComponent',
  title: 'Headline Component',
  type: 'object',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'text',
          title: 'Text',
          type: 'text',
          rows: 2,
        }),
        defineField({
          name: 'level',
          title: 'Heading Level',
          type: 'string',
          options: {
            list: [
              { title: 'H1', value: 'h1' },
              { title: 'H2', value: 'h2' },
              { title: 'H3', value: 'h3' },
              { title: 'H4', value: 'h4' },
            ],
            layout: 'dropdown'
          }
        })
      ]
    }),
    defineField({
      name: 'selfAlign',
      title: 'Self Alignment',
      type: 'string',
      options: {
        list: [
          { title: 'Top', value: 'top' },
          { title: 'Default', value: 'default' },
          { title: 'Bottom', value: 'bottom' }
        ]
      },
      initialValue: 'default'
    })
  ],
  preview: {
    select: {
      title: 'headline.text',
      subtitle: 'headline.level'
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Empty Headline',
        subtitle: subtitle ? `Heading ${subtitle.toUpperCase()}` : 'Headline Component'
      }
    }
  }
})
