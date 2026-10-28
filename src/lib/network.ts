// Optional URL-wrapper proxy for external navigation. Configure VITE_WEB_PROXY_TEMPLATE
// as a provider URL containing the literal {url} placeholder. This does not proxy all
// browser traffic; API calls and embedded services may connect directly.
export function withWebProxy(url: string): string {
  const template = import.meta.env.VITE_WEB_PROXY_TEMPLATE as string | undefined
  if (!template || !template.includes('{url}')) return url
  return template.replace('{url}', encodeURIComponent(url))
}
