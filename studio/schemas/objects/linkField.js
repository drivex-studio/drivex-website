import {defineField, defineType} from 'sanity'
import {LinkIcon} from '@sanity/icons/Link'

export default defineType({
  name: 'linkField',
  title: 'Link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'type',
      title: 'Link Type',
      type: 'string',
      options: {
        list: [
          {title: 'Internal', value: 'internal'},
          {title: 'External', value: 'external'},
          {title: 'Email', value: 'email'},
          {title: 'Modal', value: 'modal'},
        ],
        layout: 'radio',
      },
      initialValue: 'internal',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'customText',
      title: 'Custom Link Text',
      type: 'string',
      description: 'Overrides the default label/text shown for this link',
    }),
    defineField({
      name: 'internal',
      title: 'Internal Reference',
      type: 'object',
      hidden: ({parent}) => parent?.type !== 'internal',
      fields: [
        defineField({
          name: 'link',
          title: 'Reference',
          type: 'reference',
          to: [
            {type: 'page'},
            {type: 'project'},
            {type: 'caseStudy'},
            {type: 'landingPage'},
            {type: 'award'},
            {type: 'contactSection'},
            {type: 'contactSectionDocument'},
          ],
        }),
      ],
    }),
    defineField({
      name: 'external',
      title: 'External URL',
      type: 'url',
      hidden: ({parent}) => parent?.type !== 'external',
      validation: (Rule) =>
        Rule.uri({scheme: ['http', 'https']}).custom((value, context) => {
          if (context.parent?.type === 'external' && !value) return 'External URL is required'
          return true
        }),
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      hidden: ({parent}) => parent?.type !== 'email',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.parent?.type === 'email' && !value) return 'Email is required'
          return true
        }),
    }),
    defineField({
      name: 'modalId',
      title: 'Modal',
      type: 'reference',
      to: [{type: 'promotionalPopup'}],
      hidden: ({parent}) => parent?.type !== 'modal',
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in New Tab',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'canDownload',
      title: 'Downloadable',
      type: 'boolean',
      initialValue: false,
      description: 'Marks the link as a downloadable file (e.g. a PDF)',
    }),
  ],
})
