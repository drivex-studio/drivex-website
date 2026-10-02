import {defineField, defineType} from 'sanity'
import {MenuIcon} from '@sanity/icons/Menu'

export default defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  icon: MenuIcon,
  groups: [
    {name: 'general', title: 'General', default: true},
    {name: 'items', title: 'Menu Items'},
    {name: 'flyout', title: 'Flyout'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'general',
      description: 'Internal label to identify this navigation document (e.g. "Footer", "Navigation")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'navId',
      title: 'Navigation ID',
      type: 'slug',
      group: 'general',
      description: 'Unique identifier used to reference this navigation from the front end (e.g. "nav", "footer")',
      options: {source: 'title'},
      validation: (Rule) => Rule.required(),
    }),

    // Main menu
    defineField({
      name: 'items',
      title: 'Menu Items',
      type: 'array',
      group: 'items',
      of: [{type: 'navigationItem'}],
    }),
    defineField({
      name: 'headerCta',
      title: 'Header CTA',
      type: 'linkField',
      group: 'items',
      description: 'Call-to-action button shown in the header',
    }),

    // Flyout menu content
    defineField({
      name: 'flyoutAvailability',
      title: 'Flyout Availability',
      type: 'flyoutAvailability',
      group: 'flyout',
    }),
    defineField({
      name: 'flyoutCenterImage',
      title: 'Flyout Center Image',
      type: 'flyoutCenterImage',
      group: 'flyout',
    }),
    defineField({
      name: 'flyoutFeaturedProject',
      title: 'Flyout Featured Project',
      type: 'flyoutFeaturedProject',
      group: 'flyout',
    }),
    defineField({
      name: 'flyoutContact',
      title: 'Flyout Contact',
      type: 'flyoutContact',
      group: 'flyout',
    }),
    defineField({
      name: 'flyoutLocation',
      title: 'Flyout Location',
      type: 'string',
      group: 'flyout',
      description: 'e.g. "Working Globally"',
    }),
    defineField({
      name: 'flyoutTeam',
      title: 'Flyout Team',
      type: 'array',
      group: 'flyout',
      of: [{type: 'teamMember'}],
    }),
    defineField({
      name: 'flyoutSocials',
      title: 'Flyout Social Links',
      type: 'array',
      group: 'flyout',
      of: [{type: 'socialLink'}],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'navId.current',
    },
  },
})
