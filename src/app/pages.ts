import { Home, Sparkles, MessageSquare, Music, Clapperboard, Gamepad2, ShoppingBag, Settings, User } from 'lucide-react'

export const pages = {
  '/home': { label: 'Home', icon: Home },
  '/ai': { label: 'Orbit AI', icon: Sparkles },
  '/chat': { label: 'Chat', icon: MessageSquare },
  '/music': { label: 'Music', icon: Music },
  '/movies': { label: 'Movies', icon: Clapperboard },
  '/games': { label: 'Games', icon: Gamepad2 },
  '/shop': { label: 'Marketplace', icon: ShoppingBag },
  '/settings': { label: 'Settings', icon: Settings },
  '/profile': { label: 'Profile', icon: User },
} as const

export type PagePath = keyof typeof pages
export const navOrder: PagePath[] = ['/ai', '/chat', '/music', '/movies', '/games', '/shop', '/settings']

export const pageFor = (path: string) => pages[('/' + path.split('/')[1]) as PagePath] ?? pages['/home']
export const toAddress = (path: string) => 'orbit://' + path.replace(/^\//, '')
