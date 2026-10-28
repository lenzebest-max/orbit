import { load, save } from './storage'

export type Palette = { bg: string; panel: string; raised: string; line: string; fg: string; muted: string }

// Every theme is a base palette; the accent is picked separately.
export const themes: Record<string, Palette & { accent: string }> = {
  Solar: { bg: '#000000', panel: '#0a0a0a', raised: '#151515', line: '#262626', fg: '#fafafa', muted: '#8c8c8c', accent: '#ffffff' },
  Eclipse: { bg: '#050505', panel: '#0d0d0f', raised: '#18181c', line: '#2a2a30', fg: '#f4f4f5', muted: '#8b8b94', accent: '#fbbf24' },
  Nebula: { bg: '#07040f', panel: '#0e0a1a', raised: '#181227', line: '#2a2140', fg: '#f3f0ff', muted: '#948bb0', accent: '#a78bfa' },
  Midnight: { bg: '#050914', panel: '#0a1020', raised: '#121a2e', line: '#1f2a44', fg: '#eef2ff', muted: '#8590ad', accent: '#60a5fa' },
  Forest: { bg: '#040a07', panel: '#08120d', raised: '#0f1c15', line: '#1b2e23', fg: '#ecfdf3', muted: '#86a393', accent: '#6ee7b7' },
  Ember: { bg: '#0b0503', panel: '#140a06', raised: '#20120b', line: '#3a2116', fg: '#fff4ed', muted: '#b0907f', accent: '#fb923c' },
  Synthwave: { bg: '#0a0414', panel: '#120822', raised: '#1c0f31', line: '#34195a', fg: '#fdf2ff', muted: '#a98bbd', accent: '#f472b6' },
  Glacier: { bg: '#03090c', panel: '#071318', raised: '#0d1e25', line: '#183440', fg: '#ecfeff', muted: '#83a7b1', accent: '#67e8f9' },
  Light: { bg: '#fafafa', panel: '#ffffff', raised: '#f0f0f0', line: '#e0e0e0', fg: '#0a0a0a', muted: '#6b6b6b', accent: '#0a0a0a' },
}

export const accents: Record<string, string> = {
  Sun: '#ffffff', Gold: '#fbbf24', Mint: '#6ee7b7', Sky: '#60a5fa', Grape: '#a78bfa',
  Rose: '#fb7185', Tangerine: '#fb923c', Lime: '#a3e635', Bubblegum: '#f472b6', Ice: '#67e8f9',
}

export type ThemeSettings = { theme: string; accent: string | null; custom: string | null }
const KEY = 'orbit.theme'

export const loadTheme = () => load<ThemeSettings>(KEY, { theme: 'Solar', accent: null, custom: null })

const rgb = (hex: string) => {
  const n = parseInt(hex.replace('#', ''), 16)
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`
}
const luminance = (hex: string) => {
  const [r, g, b] = rgb(hex).split(' ').map(Number)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255
}

export function applyTheme(s: ThemeSettings) {
  save(KEY, s)
  const t = themes[s.theme] ?? themes.Solar
  const accent = s.custom ?? s.accent ?? t.accent
  const root = document.documentElement.style
  for (const k of ['bg', 'panel', 'raised', 'line', 'fg', 'muted'] as const) root.setProperty(`--${k}`, rgb(t[k]))
  root.setProperty('--accent', rgb(accent))
  root.setProperty('--on-accent', luminance(accent) > 0.6 ? '0 0 0' : '255 255 255')
}
