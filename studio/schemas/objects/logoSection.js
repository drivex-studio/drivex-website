import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'logoSection',
  title: 'Logo Section',
  type: 'object',
  fields: [
    defineField({
      name: 'trustedBy',
      title: 'Trusted By',
      type: 'trustedBy',
    }),
    defineField({
      name: 'theme',
      title: 'Theme',
      type: 'string',
      options: {
        list: [
          { title: 'Light', value: 'light' },
          { title: 'Dark', value: 'dark' },
        ],
        layout: 'radio',
      },
      initialValue: 'light',
    }),
    defineField({
      name: 'paddingTop',
      title: 'Padding Top',
      type: 'string',
      options: {
        list: [
          { title: 'None', value: 'none' },
          { title: 'XS', value: 'xs' },
          { title: 'SM', value: 'sm' },
          { title: 'MD', value: 'md' },
          { title: 'LG', value: 'lg' },
          { title: 'XL', value: 'xl' },
        ],
      },
      initialValue: 'none',
    }),
    defineField({
      name: 'paddingBottom',
      title: 'Padding Bottom',
      type: 'string',
      options: {
        list: [
          { title: 'None', value: 'none' },
          { title: 'XS', value: 'xs' },
          { title: 'SM', value: 'sm' },
          { title: 'MD', value: 'md' },
          { title: 'LG', value: 'lg' },
          { title: 'XL', value: 'xl' },
        ],
      },
      initialValue: 'none',
    }),
  ],
  preview: {
    select: {
      title: 'trustedBy.title',
    },
    prepare({ title }) {
      return {
        title: title || 'Logo Section',
      }
    },
  },
})
