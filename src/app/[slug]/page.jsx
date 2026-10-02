import { notFound } from 'next/navigation'
import { sanityFetch } from '@/libs/sanity/live'
import { pageByUriQuery } from '@/libs/sanity/queries/page'
import { SectionRenderer } from '@/sections/SectionRenderer'

const toParams = (slug) => ({ uri: `/${slug}`, slug })

export async function generateMetadata({ params }) {
  const { slug } = await params
  const { data: page } = await sanityFetch({
    query: pageByUriQuery,
    params: toParams(slug),
    stega: false,
  })

  const seo = page?.seoMetadata

  return {
    title: seo?.title || page?.title,
    description: seo?.description,
    robots: seo?.noIndex ? { index: false, follow: false } : undefined,
  }
}

export default async function SlugPage({ params }) {
  const { slug } = await params
  const { data: page } = await sanityFetch({
    query: pageByUriQuery,
    params: toParams(slug),
  })

  if (!page) notFound()

  return <SectionRenderer sections={page.pageBuilder?.sectionsArray} />
}
