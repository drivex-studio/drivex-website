import { groq } from 'next-sanity'

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

export const pageByUriQuery = groq`*[_type == "page" && uri.current == $uri][0]{
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
