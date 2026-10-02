import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'promotionalPopup',
  title: 'Promotional Popup',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'e.g. "[VOTE FOR US]"',
    }),
    defineField({
      name: 'subheadline',
      title: 'Subheadline',
      type: 'text',
    }),
    defineField({
      name: 'media',
      title: 'Media',
      type: 'object',
      fields: [
        defineField({
          name: 'type',
          title: 'Media Type',
          type: 'string',
          options: {
            list: ['image', 'video', 'externalVideo'],
          },
          initialValue: 'image',
        }),
        defineField({
          name: 'image',
          title: 'Image',
          type: 'image',
          options: { hotspot: true },
          hidden: ({ parent }) => parent?.type !== 'image',
        }),
        defineField({
          name: 'video',
          title: 'Video File',
          type: 'file',
          options: { accept: 'video/*' },
          hidden: ({ parent }) => parent?.type !== 'video',
        }),
        defineField({
          name: 'externalVideoUrl',
          title: 'External Video URL',
          type: 'url',
          hidden: ({ parent }) => parent?.type !== 'externalVideo',
        }),
      ],
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'linkField',
    }),
    defineField({
      name: 'displayDelay',
      title: 'Display Delay (seconds)',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'showOnEveryVisit',
      title: 'Show On Every Visit',
      type: 'boolean',
      initialValue: false,
      description: 'If false, popup shows only once per visitor (e.g. via localStorage/cookie)',
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: false,
      description: 'Toggle to enable/disable this popup on the live site',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'label',
      active: 'isActive',
    },
    prepare({ title, subtitle, active }) {
      return {
        title: title || 'Promotional Popup',
        subtitle: `${subtitle || ''} ${active ? '(Active)' : '(Inactive)'}`,
      }
    },
  },
})
