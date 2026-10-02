import { notFound } from 'next/navigation'
import { sanityFetch } from '@/libs/sanity/live'
import { homepageQuery } from '@/libs/sanity/queries/homepage'
import { SectionRenderer } from '@/sections/SectionRenderer'

export async function generateMetadata() {
  const { data: page } = await sanityFetch({
    query: homepageQuery,
    params: { id: 'homepage' },
    stega: false,
  })
  
  const seo = page?.seoMetadata

  return {
    title: seo?.title || page?.title,
    description: seo?.description,
    robots: seo?.noIndex ? { index: false, follow: false } : undefined,
  }
}

export default async function HomePage() {
  const { data: page } = await sanityFetch({
    query: homepageQuery,
    params: { id: 'homepage' },
  })
  
  if (!page) notFound()

  return <SectionRenderer sections={page.pageBuilder?.sectionsArray} />
}
