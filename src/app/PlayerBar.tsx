import { AnimatePresence, motion } from 'motion/react'
import { Pause, Play, SkipBack, SkipForward, Volume2 } from 'lucide-react'
import { usePlayer } from '../lib/player'

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

export default function PlayerBar() {
  const p = usePlayer()
  return (
    <AnimatePresence>
      {p.track && (
        <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="h-16 shrink-0 border-t border-line bg-panel flex items-center gap-4 px-4">
          <img src={p.track.art} alt="" className="w-10 h-10 rounded-lg object-cover bg-raised" />
          <div className="w-48 min-w-0">
            <div className="text-sm font-medium truncate">{p.track.title}</div>
            <div className="text-xs text-muted truncate">{p.track.artist}</div>
          </div>
          <div className="flex-1 flex flex-col items-center gap-1 max-w-xl mx-auto">
            <div className="flex items-center gap-4">
              <button onClick={p.prev} className="text-muted hover:text-fg" aria-label="Previous"><SkipBack size={16} /></button>
              <button onClick={p.toggle} className="w-8 h-8 rounded-full bg-accent text-on-accent grid place-items-center hover:scale-105 transition-transform" aria-label={p.playing ? 'Pause' : 'Play'}>
                {p.playing ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
              </button>
              <button onClick={p.next} className="text-muted hover:text-fg" aria-label="Next"><SkipForward size={16} /></button>
            </div>
            <div className="w-full flex items-center gap-2 text-[11px] text-muted">
              <span className="w-8 text-right">{fmt(p.progress)}</span>
              <input type="range" min={0} max={p.duration || 1} value={p.progress} onChange={(e) => p.seek(+e.target.value)} className="flex-1 accent-[rgb(var(--accent))] h-1" />
              <span className="w-8">{fmt(p.duration)}</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 w-32">
            <Volume2 size={15} className="text-muted" />
            <input type="range" min={0} max={1} step={0.01} value={p.volume} onChange={(e) => p.setVolume(+e.target.value)} className="flex-1 accent-[rgb(var(--accent))] h-1" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
