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

// modalId is a plain string in the data today ("cal-booking");
// this also keeps working if it is later changed to a reference.
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
      type == "internal" => "/" + coalesce(internal.link->uri.current, internal.link->slug.current, ""),
      type == "external" => external,
      type == "email" => "mailto:" + email
    )
  }
}`

const CASE_STUDY = groq`{
  _id,
  title,
  "uri": uri.current,
  mainImage{ type, highResolution, externalVideoUrl, "image": image${IMAGE} }
}`

const TRUSTED_BY = groq`{
  title,
  items[]{ _key, _type, alt, svgCode, variant, text }
}`

export const homepageQuery = groq`*[_type == "page" && _id == $id][0]{
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
          "depthMapUrl": depthMap.asset->url,
          ctas{ ..., buttons[]${BUTTON} },
          trustedBy${TRUSTED_BY}
        }
      },

      _type == "logoSectionField" => {
        sectionContent{ ..., trustedBy${TRUSTED_BY} }
      },

      _type == "cardsSectionField" => {
        sectionContent{
          ...,
          cards[]{
            ...,
            _type == "mediaCard" => {
              media{
                ...,
                image{
                  ...,
                  "lqip": asset->metadata.lqip,
                  "dimensions": asset->metadata.dimensions
                }
              }
            }
          }
        }
      },

      _type == "animatedListSectionField" => {
        sectionContent{
          ...,
          items[]{ ..., "image": image${IMAGE} }
        }
      },

      _type == "featuredWorkSectionField" => {
        sectionContent{
          ...,
          caseStudies[]->${CASE_STUDY},
          "viewAllButton": viewAllButton${BUTTON}
        }
      },

      _type == "indexedGridSectionField" => {
        sectionContent{
          ...,
          items[]{ ..., caseStudy->${CASE_STUDY} }
        }
      },

      _type == "accordionSectionField" => {
        sectionContent{
          ...,
          items[]{ _key, headline, "text": text${RICH_TEXT} }
        }
      },

      _type == "columnLayoutSectionField" => {
        sectionContent{
          ...,
          columns[]{
            ...,
            components[]{
              ...,
              _type == "imageComponent" => { "image": image{ ..., "image": image${IMAGE} } },
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
