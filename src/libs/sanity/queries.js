
const LINK_PROJECTION = `{
  "type": type,
  "href": select(
    type == "internal" => "/" + coalesce(internal.link->uri.current, internal.link->slug.current, ""),
    type == "external" => external,
    type == "email" => "mailto:" + email,
    type == "modal" => "#"
  ),
  "modalId": modalId->_id,
  openInNewTab,
  canDownload
}`

// Menu items: shared by the header and the footer.
// Singleton site settings (document _id: "site")
const SPOTS_REMAINING = `*[_type == "site"][0].spotsRemaining`

const NAV_ITEMS_PROJECTION = `{
  _key,
  text,
  "link": navigationItemUrl${LINK_PROJECTION}
}`

// Socials: the Studio stores `platform` + `url`, but the UI reads `name` + `href`.
const SOCIALS_PROJECTION = `{
  _key,
  "name": platform,
  handle,
  "href": url
}`

// Portable Text: resolve `linkField` annotations so SanityLink gets a real `href`.
// Without this, markDefs only contain the raw reference ({ internal.link._ref }).
const RICH_TEXT_PROJECTION = `{
  ...,
  markDefs[]{
    ...,
    _type == "linkField" => ${LINK_PROJECTION}
  }
}`

export const HEADER_QUERY = `
  *[_type == "navigation" && navId.current == "nav"][0]{
    "spotsRemaining": ${SPOTS_REMAINING},
    "navItems": items[]${NAV_ITEMS_PROJECTION},
    "headerCta": headerCta{
      "text": customText,
      ...${LINK_PROJECTION}
    },
    "flyout": {
      "availability": flyoutAvailability,
      "centerImage": flyoutCenterImage{
        image,
        caption,
        "link": link${LINK_PROJECTION}
      },
      "featuredProject": flyoutFeaturedProject{
        caption,
        "project": project->{
          _id,
          title,
          "uri": uri.current
        }
      },
      "contact": flyoutContact,
      "team": flyoutTeam,
      "socials": flyoutSocials[]${SOCIALS_PROJECTION},
      "location": flyoutLocation
    }
  }
`

// FooterClient reads: navigation.items, navigation.availability,
// contactInformation, copyrightNotice, showWatermark and the ascii* fields.
export const FOOTER_QUERY = `
  *[_type == "footer"][0]{
    title,
    "spotsRemaining": ${SPOTS_REMAINING},
    "navigation": navigation->{
      "items": items[]${NAV_ITEMS_PROJECTION},
      "availability": flyoutAvailability,
      "contact": flyoutContact,
      "team": flyoutTeam,
      "socials": flyoutSocials[]${SOCIALS_PROJECTION},
      "location": flyoutLocation
    },
    "leftText": leftText[]${RICH_TEXT_PROJECTION},
    "contactInformation": contactInformation[]${RICH_TEXT_PROJECTION},
    "copyrightNotice": copyrightNotice[]${RICH_TEXT_PROJECTION},
    showWatermark,

    "asciiImage": asciiImage.asset->url,
    "asciiDepthMap": asciiDepthMap.asset->url,
    "asciiMobileFallback": asciiMobileFallback.asset->url,
    asciiColor,
    asciiColorDark,
    asciiCellSize,
    asciiParallaxIntensity,
    asciiRevealOriginX,
    asciiRevealOriginY,

    "asciiImageLeft": asciiImageLeft.asset->url,
    "asciiDepthMapLeft": asciiDepthMapLeft.asset->url,
    "asciiMobileFallbackLeft": asciiMobileFallbackLeft.asset->url,
    asciiColorLeft,
    asciiColorDarkLeft,
    asciiCellSizeLeft,
    asciiParallaxIntensityLeft,
    asciiRevealOriginXLeft,
    asciiRevealOriginYLeft
  }
`
