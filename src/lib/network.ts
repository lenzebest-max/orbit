// Optional routing through a proxy service you control or trust. This client helper does not itself proxy traffic.
export function withWebProxy(url: string): string {
  let template = import.meta.env.VITE_WEB_PROXY_TEMPLATE as string | undefined
  try {
    const saved = localStorage.getItem('orbit.settings.proxyTemplate')
    if (saved !== null) template = saved
  } catch { /* storage may be unavailable */ }
  if (!template || !template.includes('{url}')) return url
  return template.replace('{url}', encodeURIComponent(url))
}

export type BrowserMode = 'embedded' | 'new-tab' | 'about-blank'
export function getBrowserMode(): BrowserMode {
  try {
    const mode = localStorage.getItem('orbit.settings.browser')
    if (mode === 'new-tab' || mode === 'about-blank') return mode
  } catch { /* storage may be unavailable */ }
  return 'embedded'
}

// Call directly from a click/submit handler so popup blockers allow the tab.
export function openInBrowserMode(url: string): boolean {
  const target = withWebProxy(url)
  const mode = getBrowserMode()
  if (mode === 'embedded') return false
  if (mode === 'new-tab') {
    window.open(target, '_blank', 'noopener,noreferrer')
    return true
  }
  const tab = window.open('about:blank', '_blank')
  if (tab) {
    try { tab.opener = null } catch { /* browser security */ }
    tab.location.replace(target)
    return true
  }
  return false
}
