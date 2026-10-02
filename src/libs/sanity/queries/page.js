import { groq } from 'next-sanity'

const IMAGE = groq`{
  alt,
  hotspot,
  crop,
  "url": asset->url,
  "lqip": asset->metadata.lqip,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height
}`

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
      type == "internal" => select(
  string::startsWith(coalesce(internal.link->uri.current, ""), "/") => internal.link->uri.current,
  "/" + coalesce(internal.link->uri.current, internal.link->slug.current, "")
),
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

      _type == "heroSectionField" => {
        sectionContent{
          ...,
          "asciiImageUrl": asciiImage.asset->url,
          "asciiOriginalImageUrl": asciiOriginalImage.asset->url,
          "mobileImageUrl": parallaxMobileImage.asset->url,
          "depthMapUrl": depthMap.asset->url
        }
      },

      _type == "workSliderSectionField" => {
        sectionContent{
          ...,
          "caseStudies": featuredItems[]->{
            _id,
            title,
            "uri": uri.current,
            tags,
            mainImage{ type, highResolution, externalVideoUrl, "image": image${IMAGE} }
          }
        }
      },

      _type == "textSectionField" => {
        sectionContent{
          ...,
          "appRichText": appRichText${RICH_TEXT}
        }
      },

      _type == "tabsSectionField" => {
        sectionContent{
          ...,
          items[]{
            ...,
            "text": text${RICH_TEXT}
          }
        }
      }
    }
  }
}`
