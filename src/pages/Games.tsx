import { useEffect, useMemo, useState } from 'react'
import { Heart, Clock3, ExternalLink, Gamepad2, Maximize2, RotateCw, Search, LoaderCircle, AlertTriangle } from 'lucide-react'
import { Page, SearchBox, Section, Tile, Button, Empty, useSavedState } from './_shared'
import { withWebProxy } from '../lib/network'
type Game={id:string;title:string;category:string;url:string;image:string;source:string;plays?:number;embed?:boolean}
const seed:Game[]=[
{id:'2048',title:'2048',category:'Puzzle',url:'https://play2048.co/',image:'https://raw.githubusercontent.com/gabrielecirulli/2048/master/meta/og_image.png',source:'Play2048',plays:98,embed:true},
{id:'t-rex',title:'Dinosaur Game',category:'Arcade',url:'https://elgoog.im/t-rex/',image:'',source:'ElgooG',plays:95,embed:true},
{id:'slope',title:'Slope',category:'Arcade',url:'https://poki.com/en/g/slope',image:'',source:'Poki',plays:94},
{id:'retro-bowl',title:'Retro Bowl',category:'Sports',url:'https://poki.com/en/g/retro-bowl',image:'',source:'Poki',plays:93},
{id:'drift-boss',title:'Drift Boss',category:'Driving',url:'https://poki.com/en/g/drift-boss',image:'',source:'Poki',plays:92},
{id:'subway-surfers',title:'Subway Surfers',category:'Runner',url:'https://poki.com/en/g/subway-surfers',image:'',source:'Poki',plays:91},
{id:'chess',title:'Chess',category:'Puzzle',url:'https://www.chess.com/play/computer',image:'',source:'Chess.com',plays:90},
{id:'wordle',title:'Wordle',category:'Word',url:'https://www.nytimes.com/games/wordle/index.html',image:'',source:'NYT Games',plays:89},
{id:'cookie-clicker',title:'Cookie Clicker',category:'Idle',url:'https://orteil.dashnet.org/cookieclicker/',image:'',source:'Orteil',plays:88},
{id:'hextris',title:'Hextris',category:'Puzzle',url:'https://hextris.io/',image:'',source:'Hextris',plays:87,embed:true},
{id:'littlealchemy2',title:'Little Alchemy 2',category:'Puzzle',url:'https://littlealchemy2.com/',image:'',source:'Recloak',plays:86},
{id:'geoguessr',title:'GeoGuessr',category:'Puzzle',url:'https://www.geoguessr.com/',image:'',source:'GeoGuessr',plays:85},
{id:'krunker',title:'Krunker',category:'Shooting',url:'https://krunker.io/',image:'',source:'Krunker',plays:84},
{id:'shellshockers',title:'Shell Shockers',category:'Shooting',url:'https://shellshock.io/',image:'',source:'Blue Wizard',plays:83},
{id:'smash-karts',title:'Smash Karts',category:'Driving',url:'https://smashkarts.io/',image:'',source:'Tall Team',plays:82},
{id:'basketball-stars',title:'Basketball Stars',category:'Sports',url:'https://www.crazygames.com/game/basketball-stars',image:'',source:'CrazyGames',plays:81},
{id:'stickman-hook',title:'Stickman Hook',category:'Arcade',url:'https://www.crazygames.com/game/stickman-hook',image:'',source:'CrazyGames',plays:80},
{id:'fireboy-watergirl',title:'Fireboy and Watergirl',category:'2 Player',url:'https://www.coolmathgames.com/0-fireboy-and-water-girl',image:'',source:'Coolmath Games',plays:79},
{id:'paperio2',title:'Paper.io 2',category:'Arcade',url:'https://paper-io.com/',image:'',source:'Paper.io',plays:78},
{id:'agar',title:'Agar.io',category:'Arcade',url:'https://agar.io/',image:'',source:'Miniclip',plays:77},
{id:'slither',title:'Slither.io',category:'Arcade',url:'https://slither.io/',image:'',source:'Lowtech Studios',plays:76},
{id:'minesweeper',title:'Minesweeper',category:'Puzzle',url:'https://minesweeper.online/',image:'',source:'Minesweeper Online',plays:75},
{id:'solitaire',title:'Solitaire',category:'Card',url:'https://www.solitr.com/',image:'',source:'Solitr',plays:74},
{id:'tetris',title:'Tetris',category:'Puzzle',url:'https://tetris.com/play-tetris',image:'',source:'Tetris',plays:73},
{id:'pacman',title:'Pac-Man',category:'Arcade',url:'https://freepacman.org/',image:'',source:'FreePacman',plays:72},
{id:'uno',title:'UNO',category:'Card',url:'https://pizz.uno/',image:'',source:'Pizz.uno',plays:71},
{id:'mahjong',title:'Mahjong',category:'Puzzle',url:'https://www.247mahjong.com/',image:'',source:'247 Games',plays:70},
{id:'drift-hunters',title:'Drift Hunters',category:'Driving',url:'https://www.crazygames.com/game/drift-hunters',image:'',source:'CrazyGames',plays:69},
{id:'motox3m',title:'Moto X3M',category:'Driving',url:'https://poki.com/en/g/moto-x3m',image:'',source:'Poki',plays:68},
{id:'temple-run-2',title:'Temple Run 2',category:'Runner',url:'https://poki.com/en/g/temple-run-2',image:'',source:'Poki',plays:67},
{id:'among-us',title:'Among Us',category:'Multiplayer',url:'https://www.innersloth.com/games/among-us/',image:'',source:'Innersloth',plays:66},
{id:'chess-multiplayer',title:'Lichess',category:'2 Player',url:'https://lichess.org/',image:'',source:'Lichess',plays:65},
{id:'word-search',title:'Word Search',category:'Word',url:'https://thewordsearch.com/',image:'',source:'The Word Search',plays:64},
{id:'checkers',title:'Checkers',category:'2 Player',url:'https://papergames.io/en/checkers',image:'',source:'PaperGames',plays:63},
{id:'connect4',title:'Connect Four',category:'2 Player',url:'https://papergames.io/en/connect4',image:'',source:'PaperGames',plays:62},
{id:'battleship',title:'Battleship',category:'2 Player',url:'https://papergames.io/en/battleship',image:'',source:'PaperGames',plays:61},
{id:'drawize',title:'Drawize',category:'2 Player',url:'https://drawize.com/',image:'',source:'Drawize',plays:60},
{id:'krunker-alt',title:'Shell Shockers',category:'Shooting',url:'https://shellshock.io/',image:'',source:'Blue Wizard',plays:59},
{id:'littlebigsnake',title:'Little Big Snake',category:'Arcade',url:'https://littlebigsnake.com/',image:'',source:'Little Big Snake',plays:58},
{id:'survivio',title:'Surviv.io archive',category:'Shooting',url:'https://surviv.io/',image:'',source:'Community archive',plays:57},
]
type Activity={id:string;lastPlayed:number;count:number}
const activityKey='orbit.games.activity'
export default function Games(){
 const [q,setQ]=useState('');const [view,setView]=useState('Browse');const [category,setCategory]=useState('All')
 const [favorites,setFavorites]=useSavedState<string[]>('orbit.games.favorites',[])
 const [activity,setActivity]=useSavedState<Activity[]>(activityKey,[])
 const [active,setActive]=useState<Game|null>(null);const [frameError,setFrameError]=useState(false)
 const [catalog,setCatalog]=useState<Game[]>([]);const [catalogStatus,setCatalogStatus]=useState('');const [reloadKey,setReloadKey]=useState(0)
 useEffect(()=>{let alive=true;const loadCatalog=async()=>{const endpoint=import.meta.env.VITE_GAME_CATALOG_URL as string|undefined;if(!endpoint){setCatalogStatus('Using the built-in starter catalog. Add VITE_GAME_CATALOG_URL for an approved provider catalog.');return}try{const r=await fetch(endpoint);if(!r.ok)throw new Error('Catalog returned '+r.status);const data=await r.json() as unknown;const arr=Array.isArray(data)?data:(data as {games?:unknown[]}).games??[];const parsed=arr.map((x,i)=>{const g=x as Record<string,unknown>;return {id:String(g.id??g.gameId??'external-'+i),title:String(g.title??g.name??'Untitled game'),category:String(g.category??g.genre??'Other'),url:String(g.url??g.embedUrl??g.gameUrl??''),image:String(g.image??g.thumbnail??g.cover??''),source:String(g.source??'External catalog'),plays:Number(g.plays??g.popularity??0)}}).filter(g=>g.url.startsWith('https://')&&g.title!=='Untitled game'&&g.image);if(alive){setCatalog(parsed);setCatalogStatus(parsed.length+' provider games loaded.')}}catch(e){if(alive)setCatalogStatus('Catalog unavailable: '+(e instanceof Error?e.message:'unknown error')+'. Showing starter games.')}};void loadCatalog();return()=>{alive=false}},[])
 const all=useMemo(()=>{const m=new Map<string,Game>();[...seed,...catalog].forEach(g=>m.set(g.id,g));return [...m.values()].sort((a,b)=>(b.plays??0)-(a.plays??0))},[catalog])
 const categories=['All',...Array.from(new Set(all.map(g=>g.category)))].sort((a,b)=>a==='All'?-1:a.localeCompare(b))
 const recent=useMemo(()=>[...activity].sort((a,b)=>b.lastPlayed-a.lastPlayed).map(a=>a.id),[activity])
 const list=useMemo(()=>all.filter(g=>(g.title+' '+g.category+' '+g.source).toLowerCase().includes(q.toLowerCase())&&(category==='All'||g.category===category)&&(view==='Browse'||(view==='Favorites'?favorites.includes(g.id):recent.includes(g.id)))),[all,q,category,view,favorites,recent])
 function launch(g:Game){setActivity(a=>[{id:g.id,lastPlayed:Date.now(),count:(a.find(x=>x.id===g.id)?.count??0)+1},...a.filter(x=>x.id!==g.id)].slice(0,50));setActive(g);setFrameError(false)}
 function close(){setActive(null);setFrameError(false)}
 return <Page eyebrow="PLAY" title="Games" description="Browse games, save favorites, and jump back into recent plays." action={<Button kind="secondary" onClick={()=>window.open(withWebProxy('https://poki.com/'),'_blank','noopener')}><ExternalLink size={15}/> More games</Button>}>
 <div className="max-w-2xl"><SearchBox value={q} onChange={setQ} placeholder="Search games, genres, or providers…"/></div>
 <div className="mt-4 flex flex-wrap gap-2">{['Browse','Recents','Favorites'].map(v=><button key={v} onClick={()=>setView(v)} className={'rounded-full border px-4 py-2 text-xs '+(view===v?'border-accent bg-accent text-on-accent':'border-line bg-panel text-muted')}>{v}{v==='Favorites'?' ('+favorites.length+')':v==='Recents'?' ('+activity.length+')':''}</button>)}</div>
 <div className="mt-3 flex flex-wrap gap-2">{categories.map(c=><button key={c} onClick={()=>setCategory(c)} className={'rounded-full px-3 py-1.5 text-xs '+(category===c?'bg-raised text-fg':'text-muted hover:bg-raised')}>{c}</button>)}</div>
 {catalogStatus&&<p className="mt-3 text-xs text-muted">{catalogStatus}</p>}
 {view==='Browse'&&activity.length>0&&<Section title="Recently played"><div className="flex flex-wrap gap-2">{activity.slice(0,8).map(a=>{const g=all.find(x=>x.id===a.id);return g?<button key={a.id} onClick={()=>launch(g)} className="flex items-center gap-2 rounded-xl border border-line bg-panel px-3 py-2 text-sm"><Clock3 size={14} className="text-muted"/>{g.title}</button>:null})}</div></Section>}
 <Section title={view==='Browse'?'Popular games':view} aside={<span className="text-xs text-muted">{list.length} games</span>}>
 {list.length===0?<Empty title={view==='Favorites'?'No favorites yet':view==='Recents'?'No recent games':'No games found'} body="Try a different search or category, or add an approved provider catalog."/>:<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{list.map(g=><div key={g.id} className="min-w-0"><Tile title={g.title} subtitle={g.category} image={g.image||undefined} onClick={()=>launch(g)} badge={g.source}/><div className="flex gap-2 pt-2"><Button onClick={()=>launch(g)}><Gamepad2 size={14}/> Play</Button><Button kind="quiet" onClick={()=>setFavorites(f=>f.includes(g.id)?f.filter(x=>x!==g.id):[...f,g.id])} ><Heart size={15} fill={favorites.includes(g.id)?'currentColor':'none'}/></Button></div></div>)}</div>}
 </Section>
 {active&&<div className="fixed inset-0 z-50 flex flex-col bg-black"><div className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-white/10 px-3 text-white sm:px-4"><div className="min-w-0 truncate text-sm font-medium">{active.title}</div><div className="flex shrink-0 items-center gap-1"><button onClick={()=>setFavorites(f=>f.includes(active.id)?f.filter(x=>x!==active.id):[...f,active.id])} title="Toggle favorite" aria-label="Toggle favorite" className="rounded-lg p-2 hover:bg-white/10"><Heart size={16} fill={favorites.includes(active.id)?'currentColor':'none'}/></button><button onClick={()=>setReloadKey(k=>k+1)} title="Reload game" aria-label="Reload game" className="rounded-lg p-2 hover:bg-white/10"><RotateCw size={16}/></button><button onClick={()=>{const el=document.getElementById('orbit-game-frame');if(el?.requestFullscreen)void el.requestFullscreen()}} title="Fullscreen" aria-label="Fullscreen" className="rounded-lg p-2 hover:bg-white/10"><Maximize2 size={16}/></button><button onClick={close} className="rounded-lg bg-white/10 px-3 py-1.5 text-sm">Close ✕</button></div></div><div className="relative flex min-h-0 flex-1 flex-col bg-white">{!frameError&&<iframe key={active.id+':'+reloadKey} id="orbit-game-frame" title={active.title} src={withWebProxy(active.url)} className="min-h-0 flex-1 border-0 bg-white" allow="fullscreen; autoplay; gamepad; clipboard-read; clipboard-write" allowFullScreen referrerPolicy="no-referrer-when-downgrade" onError={()=>setFrameError(true)}/>}<div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/95 p-3 text-xs text-slate-600 shadow-lg"><span className="flex items-center gap-2"><AlertTriangle size={14}/> If this site blocks embedding, open it separately.</span><Button onClick={()=>window.open(withWebProxy(active.url),'_blank','noopener,noreferrer')}><ExternalLink size={14}/> Open Game</Button></div></div><div className="flex items-center justify-between bg-panel px-4 py-2 text-xs text-muted"><span>Source: {active.source}. Third-party game sites may restrict embedding.</span><button onClick={()=>window.open(withWebProxy(active.url),'_blank','noopener,noreferrer')} className="flex items-center gap-1 hover:text-fg">Open separately <ExternalLink size={12}/></button></div></div>}
 </Page>
}
