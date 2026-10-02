import { groq } from 'next-sanity'

export const caseStudyByUriQuery = groq`*[_type == "caseStudy" && uri.current in [
  $uri,
  $uriNoSlash,
  "/" + $slug,
  $slug
]][0]{
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
      }
    }
  }
}`
