import { useState, type ReactNode } from 'react'
import { Search, Sparkles, ArrowUpRight, Gamepad2 } from 'lucide-react'
import { load, save } from '../lib/storage'

export function Page({ eyebrow, title, description, children, action }: { eyebrow?: string; title: string; description?: string; children?: ReactNode; action?: ReactNode }) {
  return <div className="min-h-full p-5 sm:p-8 lg:p-10"><div className="mx-auto max-w-6xl"><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div>{eyebrow && <div className="mb-2 text-xs font-semibold uppercase tracking-[.24em] text-accent">{eyebrow}</div>}<h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">{title}</h1>{description && <p className="mt-2 max-w-2xl text-sm text-muted">{description}</p>}</div>{action}</div>{children}</div></div>
}
export function SearchBox({ value, onChange, placeholder = 'Search Orbit…' }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <label className="flex h-11 min-w-0 items-center gap-3 rounded-2xl border border-line bg-panel px-4 focus-within:border-accent/60"><Search size={17} className="shrink-0 text-muted"/><input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} className="w-full bg-transparent text-sm outline-none placeholder:text-muted"/></label>
}
export function Card({ children, className = '', onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return <div onClick={onClick} className={`rounded-2xl border border-line bg-panel ${onClick ? 'cursor-pointer transition hover:border-accent/50 hover:bg-raised' : ''} ${className}`}>{children}</div>
}
export function Section({ title, children, aside }: { title: string; children: ReactNode; aside?: ReactNode }) {
  return <section className="mt-8"><div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-lg font-medium">{title}</h2>{aside}</div>{children}</section>
}
export function Empty({ title, body }: { title: string; body: string }) {
  return <div className="rounded-2xl border border-dashed border-line p-8 text-center"><Sparkles size={22} className="mx-auto mb-3 text-muted"/><p className="font-medium">{title}</p><p className="mt-1 text-sm text-muted">{body}</p></div>
}
export function Button({ children, onClick, kind = 'primary', disabled = false }: { children: ReactNode; onClick?: () => void; kind?: 'primary' | 'secondary' | 'quiet'; disabled?: boolean }) {
  const styles = kind === 'primary' ? 'bg-accent text-on-accent hover:opacity-90' : kind === 'secondary' ? 'border border-line bg-raised hover:border-accent/50' : 'text-muted hover:text-fg hover:bg-raised'
  return <button type={onClick ? 'button' : 'submit'} disabled={disabled} onClick={onClick} className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${styles}`}>{children}</button>
}
export function useSavedState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => load(key, initial))
  const update = (next: T | ((prev: T) => T)) => setValue(prev => { const result = typeof next === 'function' ? (next as (p:T)=>T)(prev) : next; save(key, result); return result })
  return [value, update] as const
}
export function Tile({ title, subtitle, image, onClick, badge }: { title: string; subtitle?: string; image?: string; onClick?: () => void; badge?: string }) {
  return <Card onClick={onClick} className="overflow-hidden"><div className="relative aspect-[16/10] overflow-hidden bg-raised">{image ? <img src={image} alt={title + ' cover'} loading="lazy" onError={e=>{e.currentTarget.style.display='none'}} className="absolute inset-0 h-full w-full object-cover"/> : null}<div className="absolute inset-0 bg-gradient-to-br from-accent/35 via-raised/90 to-black/95"/><div aria-hidden className="absolute -right-5 -top-5 rotate-12 text-accent/20"><Gamepad2 size={112}/></div><div className="absolute inset-0 flex flex-col justify-end p-3"><span className="mb-1 text-[9px] font-bold uppercase tracking-[.2em] text-accent">{subtitle || 'Game'}</span><span className="line-clamp-2 text-lg font-bold leading-tight text-white drop-shadow">{title}</span></div>{badge && <span className="absolute left-2 top-2 rounded-lg bg-black/75 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">{badge}</span>}</div><div className="flex items-center justify-between gap-2 p-3"><div className="min-w-0"><p className="truncate text-sm font-medium">{title}</p>{subtitle && <p className="mt-1 truncate text-xs text-muted">{subtitle}</p>}</div><ArrowUpRight size={15} className="shrink-0 text-muted"/></div></Card>
}
