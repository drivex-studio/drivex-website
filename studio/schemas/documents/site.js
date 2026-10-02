import {defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons/Cog'

// Singleton: the content lives in the document with _id "site".
export default defineType({
  name: 'site',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Site Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'spotsRemaining',
      title: 'Spots Remaining',
      type: 'number',
      description: 'Shown as "Only N spots left" in the header menu and footer. Use 0 or leave empty to hide it.',
      validation: (Rule) => Rule.integer().min(0),
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'spotsRemaining'},
    prepare: ({title, subtitle}) => ({
      title: title || 'Site Settings',
      subtitle: subtitle != null ? `${subtitle} spots left` : undefined,
    }),
  },
})
