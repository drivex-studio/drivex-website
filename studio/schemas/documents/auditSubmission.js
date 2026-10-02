import {defineType, defineField} from 'sanity'
import {CommentIcon} from '@sanity/icons/Comment'

export default defineType({
  name: 'auditSubmission',
  title: 'Audit Submission',
  type: 'document',
  icon: CommentIcon,
  readOnly: true,
  fields: [
    defineField({
      name: 'firstName',
      title: 'First Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'lastName',
      title: 'Last Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'company',
      title: 'Company',
      type: 'string',
    }),
    defineField({
      name: 'websiteUrl',
      title: 'Website URL',
      type: 'url',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      initialValue: 'pending',
      options: {
        list: [
          {title: 'Pending', value: 'pending'},
          {title: 'In Progress', value: 'in-progress'},
          {title: 'Completed', value: 'completed'},
        ],
      },
    }),
  ],
  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      company: 'company',
      status: 'status',
    },
    prepare({firstName, lastName, company, status}) {
      return {
        title: `${firstName || ''} ${lastName || ''}`.trim(),
        subtitle: `${company || 'No Company'} - ${status ? status.toUpperCase() : 'UNKNOWN'}`,
      }
    },
  },
})
