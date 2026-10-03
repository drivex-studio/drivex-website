import { groq } from 'next-sanity'

// Same fragments as homepage.js (kept local so this file is self-contained).
const LINK = groq`{
  "text": customText,
  type,
  openInNewTab,
  canDownload,
  "href": select(
    type == "internal" => select(
      string::startsWith(coalesce(internal.link->uri.current, ""), "/") => internal.link->uri.current,
      "/" + coalesce(internal.link->uri.current, internal.link->slug.current, "")
    ),
    type == "external" => external,
    type == "email" => "mailto:" + email,
    type == "modal" => "#"
  ),
  "modalId": select(defined(modalId._ref) => modalId->_id, modalId)
}`

const BUTTON = groq`{
  _key, size, theme, variant,
  "link": link${LINK}
}`

const RICH_TEXT = groq`[]{
  ...,
  markDefs[]{
    ...,
    "href": select(
      type == "internal" => select(
        string::startsWith(coalesce(internal.link->uri.current, ""), "/") => internal.link->uri.current,
        "/" + coalesce(internal.link->uri.current, internal.link->slug.current, "")
      ),
      type == "external" => external,
      type == "email" => "mailto:" + email
    )
  }
}`

// Image object as the components expect it. altText / description / title live on the asset
// document, so they are pulled in here (that is where the reference gets its alt text from).
const IMAGE_ASSET = groq`{
  ...,
  "altText": asset->altText,
  "description": asset->description,
  "title": asset->title,
  "lqip": asset->metadata.lqip,
  "dimensions": asset->metadata.dimensions
}`

// Media object shape SanityMedia expects: { type, image, externalVideoUrl, ... }.
const MEDIA = groq`{
  ...,
  "type": coalesce(type, "image"),
  image${IMAGE_ASSET}
}`

// Shape NextProjectSection expects: { title, uri (always starts with "/"), mainImage }.
const NEXT_PROJECT = groq`{
  _id,
  title,
  "uri": select(
    string::startsWith(coalesce(uri.current, ""), "/") => uri.current,
    "/" + uri.current
  ),
  mainImage${MEDIA}
}`

export const caseStudyByUriQuery = groq`*[_type == "caseStudy" && uri.current in [
  $uri,
  $uriNoSlash,
  "/" + $slug,
  $slug
]][0]{
  title,
  seoMetadata,

  // First related work, otherwise the oldest other case study.
  "nextProject": coalesce(
    relatedWorks[0]->${NEXT_PROJECT},
    *[_type == "caseStudy" && _id != ^._id && defined(uri.current)] | order(_createdAt asc)[0]${NEXT_PROJECT}
  ),

  pageBuilder{
    sectionsArray[]{
      _key,
      _type,
      sectionSettings,

      _type == "heroSectionField" => {
        sectionContent{
          ...,
          "asciiImageUrl": asciiImage.asset->url,
          "asciiOriginalImageUrl": asciiOriginalImage.asset->url,
          "mobileImageUrl": parallaxMobileImage.asset->url,
          "depthMapUrl": depthMap.asset->url,
          ctas{ ..., buttons[]${BUTTON} },
          "parallaxMedia": parallaxMedia${MEDIA},
          "mobileImage": parallaxMobileImage${IMAGE_ASSET}
        }
      },

      _type == "gallerySectionField" => {
        sectionContent{
          ...,
          items[]{ ..., "media": media${MEDIA} }
        }
      },

      _type == "mediaSectionField" => {
        sectionContent{
          ...,
          "appMedia": appMedia${MEDIA}
        }
      },

      _type == "columnLayoutSectionField" => {
        sectionContent{
          ...,
          columns[]{
            ...,
            components[]{
              ...,
              _type == "imageComponent" => {
                "image": image{
                  ...,
                  "type": coalesce(type, "image"),
                  image${IMAGE_ASSET}
                }
              },
              _type == "textComponent" => { "text": text${RICH_TEXT} },
              _type == "buttonComponent" => { "button": button${BUTTON} },
              _type == "buttonGroupComponent" => {
                buttonGroup{ ..., buttons[]${BUTTON} }
              }
            }
          }
        }
      }
    }
  }
}`
