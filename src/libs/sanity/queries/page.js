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

const TRUSTED_BY = groq`{
  title,
  items[]{ _key, _type, alt, svgCode, variant, text }
}`

// Hero: HeroSection reads mobileImage (an image object) while the Studio field is parallaxMobileImage,
// so it is aliased inside the hero branch below. Keep backticks out of comments inside the template.
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
          "depthMapUrl": depthMap.asset->url,
          "mobileImage": parallaxMobileImage{
            ...,
            "altText": asset->altText,
            "description": asset->description,
            "title": asset->title,
            "lqip": asset->metadata.lqip,
            "dimensions": asset->metadata.dimensions
          },
          parallaxMedia{
            ...,
            image{
              ...,
              "altText": asset->altText,
              "description": asset->description,
              "title": asset->title,
              "lqip": asset->metadata.lqip,
              "dimensions": asset->metadata.dimensions
            }
          },
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

      _type == "pricingSectionField" => {
        sectionContent{
          ...,
          text${RICH_TEXT},
          "spotsRemaining": *[_type == "site"][0].spotsRemaining,
          priceCards[]{
            ...,
            button${BUTTON}
          }
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
                  image{
                    ...,
                    "altText": asset->altText,
                    "description": asset->description,
                    "title": asset->title,
                    "lqip": asset->metadata.lqip,
                    "dimensions": asset->metadata.dimensions
                  }
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
      },

      _type == "tableSectionField" => {
        sectionContent{
          ...,
          text${RICH_TEXT},
          button${BUTTON}
        }
      },

      _type == "accordionSectionField" => {
        sectionContent{
          ...,
          items[]{ _key, headline, "text": text${RICH_TEXT} }
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
            mainImage{
              ...,
              "type": coalesce(type, "image"),
              image{
                ...,
                "lqip": asset->metadata.lqip,
                "dimensions": asset->metadata.dimensions
              }
            }
          }
        }
      },

      _type == "textSectionField" => {
        sectionContent{
          ...,
          "appRichText": appRichText${RICH_TEXT}
        }
      },

      _type == "contactSectionField" => {
        sectionContent{
          theme,
          paddingTop,
          paddingBottom,
          "contact": contactSectionRef->{
            headline,
            formHeadline,
            contactText${RICH_TEXT},
            ctaButton${LINK},
            "image": image{
              type,
              image{
                ...,
                "altText": asset->altText,
                "description": asset->description,
                "title": asset->title,
                "lqip": asset->metadata.lqip,
                "dimensions": asset->metadata.dimensions
              }
            }
          }
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