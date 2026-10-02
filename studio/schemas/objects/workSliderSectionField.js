import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'workSliderSectionField',
  title: 'Work Slider Section Field',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionContent',
      title: 'Section Content',
      type: 'workSliderSection',
    }),
  ],
  preview: {
    select: { 
      items: 'sectionContent.featuredItems' 
    },
    prepare({ items }) {
      const itemsCount = items ? items.length : 0
      return {
        title: 'Work Slider Section',
        subtitle: `${itemsCount} item${itemsCount !== 1 ? 's' : ''}`,
      }
    },
  },
})
