import {defineField, defineType} from 'sanity'
import {EnvelopeIcon} from '@sanity/icons/Envelope'

export default defineType({
  name: 'flyoutContact',
  title: 'Flyout Contact',
  type: 'object',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'email',
      title: 'Contact Email',
      type: 'string',
      validation: (Rule) =>
        Rule.required().regex(/^\S+@\S+\.\S+$/, {name: 'email', invert: false}),
    }),
  ],
})
