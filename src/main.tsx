import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { LockKeyhole, ShieldCheck } from 'lucide-react'
import './index.css'
import Shell from './app/Shell'
import { applyTheme, loadTheme } from './lib/theme'

const UNLOCK_KEY='orbit.workspace.unlocked'
function PrivacyGate({children}:{children:React.ReactNode}) {
 const [unlocked,setUnlocked]=useState(()=>{try{return localStorage.getItem(UNLOCK_KEY)==='true'}catch{return false}})
 const [held,setHeld]=useState<string[]>([])
 useEffect(()=>{if(unlocked)return;const down=(e:KeyboardEvent)=>{const k=e.key.toLowerCase();if(['l','e','n'].includes(k)){setHeld(p=>{const next=Array.from(new Set([...p,k]));if(['l','e','n'].every(x=>next.includes(x))){try{localStorage.setItem(UNLOCK_KEY,'true')}catch { /* privacy unlock remains in memory */ };setUnlocked(true)}return next})}};const up=(e:KeyboardEvent)=>{const k=e.key.toLowerCase();setHeld(p=>p.filter(x=>x!==k))};window.addEventListener('keydown',down);window.addEventListener('keyup',up);return()=>{window.removeEventListener('keydown',down);window.removeEventListener('keyup',up)}},[unlocked])
 if(unlocked)return <>{children}</>
 return <main className="privacy-gate"><div className="privacy-card"><div className="privacy-mark"><ShieldCheck size={25}/></div><div className="privacy-eyebrow">PRIVATE WORKSPACE</div><h1>Welcome back.</h1><p>This workspace is locked for privacy. Hold <kbd>L</kbd> + <kbd>E</kbd> + <kbd>N</kbd> together to continue.</p><div className="privacy-status"><LockKeyhole size={15}/><span>{held.length===0?'Workspace locked':held.length+' of 3 keys detected'}</span></div><div className="privacy-dots"><i className={held.includes('l')?'lit':''}/><i className={held.includes('e')?'lit':''}/><i className={held.includes('n')?'lit':''}/></div><span className="privacy-foot">ORBIT · LOCAL PRIVACY SCREEN</span></div></main>
}
applyTheme(loadTheme())
createRoot(document.getElementById('root')!).render(<StrictMode><PrivacyGate><HashRouter><Shell/></HashRouter></PrivacyGate></StrictMode>)
