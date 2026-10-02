import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'sectionHeaderComponent',
  title: 'Section Header Component',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'e.g. "// Services"',
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'object',
      fields: [
        defineField({
          name: 'level',
          title: 'Heading Level',
          type: 'string',
          options: { list: ['h1', 'h2', 'h3', 'h4'] },
        }),
        defineField({
          name: 'text',
          title: 'Text',
          type: 'string',
        }),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: 'headline.text', subtitle: 'label' },
    prepare({ title, subtitle }) {
      return { title: title || 'Empty Section Header', subtitle }
    },
  },
})
