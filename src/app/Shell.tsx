import { useEffect, useState, type FormEvent } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, RotateCw, Plus, X, Star, PanelLeft, Lock, UserCircle } from 'lucide-react'
import { navOrder, pageFor, pages, toAddress } from './pages'
import { PlayerProvider } from '../lib/player'
import PlayerBar from './PlayerBar'
import { load, save } from '../lib/storage'
import Home from '../pages/Home'
import AI from '../pages/AI'
import Chat from '../pages/Chat'
import MusicPage from '../pages/Music'
import Movies from '../pages/Movies'
import Games from '../pages/Games'
import Shop from '../pages/Shop'
import SettingsPage from '../pages/Settings'
import Profile from '../pages/Profile'
import WebPage from '../pages/Web'

type Tab = { id: number; path: string }
const TABS_KEY = 'orbit.tabs'

export default function Shell() {
  const location = useLocation()
  const navigate = useNavigate()
  const [tabs, setTabs] = useState<Tab[]>(() => load(TABS_KEY, [{ id: 1, path: '/home' }]))
  const [active, setActive] = useState(() => tabs[0]?.id ?? 1)
  const [collapsed, setCollapsed] = useState(false)
  const [address, setAddress] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  // The URL drives the active tab's page.
  useEffect(() => {
    setTabs((ts) => ts.map((t) => (t.id === active ? { ...t, path: location.pathname } : t)))
    setAddress(toAddress(location.pathname))
  }, [location.pathname, active])

  useEffect(() => save(TABS_KEY, tabs), [tabs])

  const newTab = (path = '/home') => {
    const id = Math.max(0, ...tabs.map((t) => t.id)) + 1
    setTabs((ts) => [...ts, { id, path }])
    setActive(id)
    navigate(path)
  }
  const openPage = (path: string) => {
    const existing = tabs.find((t) => t.path.startsWith(path))
    if (existing) switchTo(existing)
    else newTab(path)
  }
  const switchTo = (t: Tab) => {
    setActive(t.id)
    navigate(t.path)
  }
  const closeTab = (id: number) => {
    const rest = tabs.filter((t) => t.id !== id)
    if (rest.length === 0) {
      setTabs([{ id: id + 1, path: '/home' }])
      setActive(id + 1)
      navigate('/home')
      return
    }
    setTabs(rest)
    if (id === active) switchTo(rest[Math.max(0, tabs.findIndex((t) => t.id === id) - 1)])
  }

  const submitAddress = (e: FormEvent) => {
    e.preventDefault()
    const v = address.trim()
    if (v.startsWith('orbit://')) {
      const p = '/' + v.slice(8)
      navigate(pageFor(p) && p in pages ? p : '/home')
    } else if (v) {
      const engine = load('orbit.settings.search', 'DuckDuckGo') as string
      const searchUrl = engine === 'Google' ? 'https://www.google.com/search?q=' : engine === 'Bing' ? 'https://www.bing.com/search?q=' : 'https://duckduckgo.com/?q='
      const url = /^https?:\/\//.test(v) || /^[\w-]+\.[\w.]+/.test(v) ? (v.startsWith('http') ? v : 'https://' + v) : searchUrl + encodeURIComponent(v)
      navigate('/web?url=' + encodeURIComponent(url))
      setAddress(toAddress(location.pathname))
    }
  }

  return (
    <PlayerProvider>
      <div className="orbit-app h-full flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="h-12 shrink-0 flex items-center gap-1 px-2 border-b border-line bg-panel">
          <IconBtn onClick={() => setCollapsed((c) => !c)} label="Toggle sidebar"><PanelLeft size={16} /></IconBtn>
          <IconBtn onClick={() => window.history.back()} label="Back"><ArrowLeft size={16} /></IconBtn>
          <IconBtn onClick={() => window.history.forward()} label="Forward"><ArrowRight size={16} /></IconBtn>
          <IconBtn onClick={() => setReloadKey((k) => k + 1)} label="Reload"><RotateCw size={15} /></IconBtn>
          <form onSubmit={submitAddress} className="flex-1 max-w-3xl mx-auto">
            <label className="flex items-center gap-2 h-8 px-3 rounded-full bg-raised border border-line focus-within:border-accent/50 transition-colors">
              <Lock size={12} className="text-muted" />
              <input value={address} onChange={(e) => setAddress(e.target.value)} onFocus={(e) => e.target.select()}
                className="flex-1 bg-transparent outline-none text-sm" spellCheck={false} aria-label="Address" />
            </label>
          </form>
          <IconBtn label="Bookmark"><Star size={15} /></IconBtn>
          <button onClick={() => openPage('/profile')} className="flex items-center gap-1.5 h-8 px-3 rounded-full text-sm hover:bg-raised transition-colors">
            <UserCircle size={16} /> <span className="hidden sm:inline">Sign in</span>
          </button>
        </div>

        <div className="flex-1 flex min-h-0">
          {/* Sidebar */}
          <motion.aside animate={{ width: collapsed ? 64 : 220 }} transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="shrink-0 flex flex-col border-r border-line bg-panel overflow-hidden">
            <div className="p-2 space-y-1 flex-1 overflow-y-auto no-scrollbar">
              <SideItem icon={Plus} label="New Tab" collapsed={collapsed} onClick={() => newTab()} />
              <AnimatePresence initial={false}>
                {tabs.map((t) => {
                  const p = pageFor(t.path)
                  return (
                    <motion.div key={t.id} layout initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
                      <SideItem icon={p.icon} label={p.label} collapsed={collapsed} active={t.id === active}
                        onClick={() => switchTo(t)} onClose={() => closeTab(t.id)} />
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
            <div className="p-2 space-y-1 border-t border-line">
              {navOrder.map((p) => (
                <SideItem key={p} icon={pages[p].icon} label={pages[p].label} collapsed={collapsed} onClick={() => openPage(p)}
                  current={location.pathname.startsWith(p)} />
              ))}
            </div>
          </motion.aside>

          {/* Page */}
          <main className="flex-1 min-w-0 relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div key={location.pathname + reloadKey} className="absolute inset-0 overflow-y-auto thin-scroll"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
                <Routes location={location}>
                  <Route path="/home" element={<Home openPage={openPage} />} />
                  <Route path="/ai" element={<AI />} />
                  <Route path="/chat/*" element={<Chat />} />
                  <Route path="/music" element={<MusicPage />} />
                  <Route path="/movies" element={<Movies />} />
                  <Route path="/games" element={<Games />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/web" element={<WebPage />} />
                  <Route path="*" element={<Navigate to="/home" replace />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
        <PlayerBar />
      </div>
    </PlayerProvider>
  )
}

function IconBtn({ children, onClick, label }: { children: React.ReactNode; onClick?: () => void; label: string }) {
  return (
    <button onClick={onClick} aria-label={label} title={label}
      className="w-8 h-8 grid place-items-center rounded-full text-muted hover:text-fg hover:bg-raised transition-colors">
      {children}
    </button>
  )
}

type SideProps = { icon: React.ComponentType<{ size?: number }>; label: string; collapsed: boolean; onClick: () => void; active?: boolean; current?: boolean; onClose?: () => void }
function SideItem({ icon: Icon, label, collapsed, onClick, active, current, onClose }: SideProps) {
  return (
    <div onClick={onClick} title={label}
      className={`group relative flex items-center gap-3 h-9 px-3 rounded-xl cursor-pointer text-sm select-none transition-colors
        ${active ? 'bg-accent text-on-accent shadow-[0_0_24px_rgb(var(--accent)/0.25)]' : current ? 'text-fg bg-raised' : 'text-muted hover:text-fg hover:bg-raised'}`}>
      <span className="shrink-0"><Icon size={16} /></span>
      {!collapsed && <span className="truncate flex-1">{label}</span>}
      {!collapsed && onClose && (
        <button onClick={(e) => { e.stopPropagation(); onClose() }} aria-label={`Close ${label}`}
          className={`opacity-60 hover:opacity-100 ${active ? '' : 'opacity-0 group-hover:opacity-60'}`}>
          <X size={14} />
        </button>
      )}
    </div>
  )
}
