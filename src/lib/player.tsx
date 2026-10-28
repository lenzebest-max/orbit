import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'

export type Track = { id: string; title: string; artist: string; art: string; src: string }

type Player = {
  track: Track | null
  playing: boolean
  progress: number
  duration: number
  queue: Track[]
  play: (t: Track, queue?: Track[]) => void
  toggle: () => void
  next: () => void
  prev: () => void
  seek: (s: number) => void
  volume: number
  setVolume: (v: number) => void
}

const Ctx = createContext<Player | null>(null)
export const usePlayer = () => useContext(Ctx)!

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audio = useRef<HTMLAudioElement>(new Audio())
  const [track, setTrack] = useState<Track | null>(null)
  const [queue, setQueue] = useState<Track[]>([])
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVol] = useState(0.8)

  const play = (t: Track, q?: Track[]) => {
    if (q) setQueue(q)
    setTrack(t)
    audio.current.src = t.src
    audio.current.play().catch(() => setPlaying(false))
  }
  const step = (dir: 1 | -1) => {
    if (!track) return
    const i = queue.findIndex((t) => t.id === track.id)
    const n = queue[i + dir]
    if (n) play(n)
  }

  useEffect(() => {
    const a = audio.current
    a.volume = volume
    const on = () => setPlaying(true)
    const off = () => setPlaying(false)
    const time = () => { setProgress(a.currentTime); setDuration(a.duration || 0) }
    a.addEventListener('play', on)
    a.addEventListener('pause', off)
    a.addEventListener('timeupdate', time)
    return () => { a.removeEventListener('play', on); a.removeEventListener('pause', off); a.removeEventListener('timeupdate', time) }
  }, [volume])

  // Auto-advance; re-bound whenever the queue or track changes.
  useEffect(() => {
    const a = audio.current
    const end = () => step(1)
    a.addEventListener('ended', end)
    return () => a.removeEventListener('ended', end)
  })

  return (
    <Ctx.Provider value={{
      track, playing, progress, duration, queue, play, volume,
      toggle: () => (audio.current.paused ? audio.current.play() : audio.current.pause()),
      next: () => step(1),
      prev: () => step(-1),
      seek: (s) => { audio.current.currentTime = s },
      setVolume: (v) => { audio.current.volume = v; setVol(v) },
    }}>
      {children}
    </Ctx.Provider>
  )
}
