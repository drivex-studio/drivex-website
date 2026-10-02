import {defineField, defineType} from 'sanity'
import {CheckmarkCircleIcon} from '@sanity/icons/CheckmarkCircle'

export default defineType({
  name: 'flyoutAvailability',
  title: 'Availability',
  type: 'object',
  icon: CheckmarkCircleIcon,
  fields: [
    defineField({
      name: 'isAvailable',
      title: 'Is Available',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'text',
      title: 'Availability Text',
      type: 'text',
      rows: 2,
      description: 'Supports line breaks, e.g. "Accepting Projects.\\nJoin the waitlist."',
    }),
  ],
})
