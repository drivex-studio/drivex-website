import { groq } from 'next-sanity'

// Looks a page up by slug. The Studio may store "/privacy-policy" (leading slash) or "privacy-policy",
// so both forms are matched: $uri = "/" + slug, $slug = slug.
// Same section projections as homepageQuery.
// Add each new *SectionField projection here as its component gets built.
//
// TextSection only needs the markDefs resolved so linkField annotations get an href.
const RICH_TEXT = groq`[]{
  ...,
  markDefs[]{
    ...,
    "href": select(
      type == "internal" => "/" + coalesce(internal.link->uri.current, internal.link->slug.current, ""),
      type == "external" => external,
      type == "email" => "mailto:" + email
    )
  }
}`

export const pageByUriQuery = groq`*[_type == "page" && uri.current in [$uri, $slug]][0]{
  title,
  seoMetadata,
  pageBuilder{
    sectionsArray[]{
      _key,
      _type,
      sectionSettings,

      _type == "textSectionField" => {
        sectionContent{
          ...,
          "appRichText": appRichText${RICH_TEXT}
        }
      }
    }
  }
}`
