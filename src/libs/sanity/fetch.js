import 'server-only'
import { draftMode } from 'next/headers'
import { client } from '@/libs/sanity/client'

export async function sanityFetch({ query, params = {}, tags = [] }) {
  const isDraftMode = (await draftMode()).isEnabled

  if (isDraftMode) {
    const token = process.env.SANITY_API_READ_TOKEN
    if (!token) {
      throw new Error('Draft mode requires SANITY_API_READ_TOKEN')
    }

    return client.fetch(query, params, {
      token,
      perspective: 'previewDrafts',
      useCdn: false,
      stega: true,
      cache: 'no-store',
    })
  }

  return client.fetch(query, params, {
    next: {
      revalidate: tags.length ? false : 60,
      tags,
    },
  })
}
