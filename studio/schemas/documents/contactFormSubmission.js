import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'contactFormSubmission',
  title: 'Contact Form Submission',
  type: 'document',
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
      name: 'budget',
      title: 'Budget',
      type: 'string',
      options: {
        list: [
          {title: '8k - 15k', value: '8-15k'},
          {title: '15k - 25k', value: '15-25k'},
          {title: '25k+', value: '25k-plus'},
        ],
      },
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
  ],

  readOnly: true,
  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      company: 'company',
      email: 'email',
    },
    prepare({firstName, lastName, company, email}) {
      return {
        title: `${firstName || ''} ${lastName || ''}`.trim() || email,
        subtitle: company || email,
      }
    },
  },
})