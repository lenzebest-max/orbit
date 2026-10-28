import { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ExternalLink, ShieldAlert, Globe } from 'lucide-react'
import { Page, Button } from './_shared'
import { withWebProxy } from '../lib/network'

export default function WebPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const raw = params.get('url') || 'https://duckduckgo.com/'
  const target = useMemo(() => {
    try {
      const u = new URL(raw)
      return ['http:', 'https:'].includes(u.protocol) ? withWebProxy(u.href) : withWebProxy('https://duckduckgo.com/')
    } catch {
      return withWebProxy('https://duckduckgo.com/')
    }
  }, [raw])
  const host = useMemo(() => { try { return new URL(target).hostname } catch { return target } }, [target])
  return <Page eyebrow="ORBIT BROWSER" title={host} description="Orbit’s internal web viewer. Sites that block embedding may need a compatible proxy service or may refuse to load." action={<><Button kind="secondary" onClick={() => navigate(-1)}><ArrowLeft size={15}/> Back</Button><Button onClick={() => window.open(target, '_blank', 'noopener,noreferrer')}><ExternalLink size={15}/> Open separately</Button></>}>
    <div className="flex min-h-[65vh] flex-col overflow-hidden rounded-2xl border border-line bg-panel">
      <div className="flex items-center gap-2 border-b border-line px-4 py-2 text-xs text-muted"><Globe size={14}/><span className="truncate">{target}</span></div>
      <iframe title={'Orbit browser: '+host} src={target} className="min-h-[65vh] w-full flex-1 border-0 bg-white" allow="fullscreen; autoplay; clipboard-read; clipboard-write" referrerPolicy="strict-origin-when-cross-origin" />
      <div className="flex items-start gap-2 border-t border-line bg-raised p-3 text-xs leading-5 text-muted"><ShieldAlert size={15} className="mt-0.5 shrink-0"/><span>If this page stays blank, the site may block iframe embedding. Orbit’s optional proxy template only works when you configure a real compatible proxy endpoint; it is not enabled automatically.</span></div>
    </div>
  </Page>
}
