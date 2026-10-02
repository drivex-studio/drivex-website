export function getProxyImageUrl(url) {
  return url.startsWith("https://cdn.sanity.io/")
    ? `/api/image-proxy?url=${encodeURIComponent(url)}`
    : url;
}
