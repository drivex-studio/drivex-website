import { notFound } from 'next/navigation'
import { sanityFetch } from '@/libs/sanity/live'
import { pageByUriQuery } from '@/libs/sanity/queries/page'
import { SectionRenderer } from '@/sections/SectionRenderer'

// The Studio stores the slug WITH the leading slash ("/privacy-policy").
const PARAMS = { uri: '/privacy-policy' }

export async function generateMetadata() {
  const { data: page } = await sanityFetch({
    query: pageByUriQuery,
    params: PARAMS,
    stega: false,
  })

  const seo = page?.seoMetadata

  return {
    title: seo?.title || page?.title,
    description: seo?.description,
    robots: seo?.noIndex ? { index: false, follow: false } : undefined,
  }
}

export default async function PrivacyPolicyPage() {
  const { data: page } = await sanityFetch({
    query: pageByUriQuery,
    params: PARAMS,
  })

  if (!page) notFound()

  return <SectionRenderer sections={page.pageBuilder?.sectionsArray} />
}
