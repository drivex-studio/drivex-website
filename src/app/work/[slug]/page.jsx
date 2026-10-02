import { notFound } from 'next/navigation'
import { sanityFetch } from '@/libs/sanity/live'
import { caseStudyByUriQuery } from '@/libs/sanity/queries/caseStudy'
import { SectionRenderer } from '@/sections/SectionRenderer'

const toParams = (slug) => ({ uri: `/work/${slug}`, uriNoSlash: `work/${slug}`, slug })

export async function generateMetadata({ params }) {
  const { slug } = await params
  const { data: caseStudy } = await sanityFetch({
    query: caseStudyByUriQuery,
    params: toParams(slug),
    stega: false,
  })

  const seo = caseStudy?.seoMetadata

  return {
    title: seo?.title || caseStudy?.title,
    description: seo?.description,
    robots: seo?.noIndex ? { index: false, follow: false } : undefined,
  }
}

export default async function CaseStudyPage({ params }) {
  const { slug } = await params
  const { data: caseStudy } = await sanityFetch({
    query: caseStudyByUriQuery,
    params: toParams(slug),
  })

  if (!caseStudy) notFound()

  return <SectionRenderer sections={caseStudy.pageBuilder?.sectionsArray} />
}
