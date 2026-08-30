// src/components/garden/InteractiveGarden.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Sun, Moon, CloudSun, Sunset, Info, X, ChevronLeft, ArrowRight, Compass, Heart, CheckCircle2 } from 'lucide-react';

export default function InteractiveGarden({ progress }) {
 const nav = useNavigate();
 const [selectedNode, setSelectedNode] = useState(null);
 const [timeOfDay, setTimeOfDay] = useState('day'); // 'morning' | 'day' | 'sunset' | 'night'

 // Determine time of day automatically on mount
 useEffect(() => {
 const hour = new Date().getHours();
 if (hour >= 5 && hour < 11) setTimeOfDay('morning');
 else if (hour >= 11 && hour < 17) setTimeOfDay('day');
 else if (hour >= 17 && hour < 20) setTimeOfDay('sunset');
 else setTimeOfDay('night');
 }, []);

 const timeline = progress?.timeline || [];
 const hasItems = timeline.length > 0;

 // Map timeline items to garden nodes with calculated coordinates and element types
 const gardenNodes = timeline.map((item, idx) => {
 // Generate deterministic coordinates on a curved natural landscape path
 const col = idx % 5;
 const row = Math.floor(idx / 5);
 
 // Spread coordinates naturally across canvas %
 const posX = 15 + (col * 18) + (row % 2 === 1 ? 8 : 0);
 const posY = 25 + (row * 22) + (col % 2 === 0 ? 5 : -5);

 const effect = item.gardenEffect || 'sprout';
 
 return {
 ...item,
 nodeId: item.id || `node_${idx}`,
 idx: idx + 1,
 x: Math.min(Math.max(posX, 10), 85),
 y: Math.min(Math.max(posY, 15), 80),
 effect
 };
 });

 // Sky & ground atmosphere styles based on timeOfDay
 const skyTheme = {
 morning: {
 label: 'نور الصباح',
 icon: CloudSun,
 bg: 'from-amber-100/80 via-emerald-50/60 to-teal-100/40',
 text: 'text-amber-900',
 badge: 'bg-amber-100/90 text-amber-900 border-amber-300',
 ground: 'bg-emerald-900/90',
 pathColor: '#4d7c67',
 skyGradient: 'from-amber-200/50 via-teal-100/30 to-emerald-50/20'
 },
 day: {
 label: 'سكينة النهار',
 icon: Sun,
 bg: 'from-emerald-500/10 via-teal-500/5 to-slate-50',
 text: 'text-teal-900',
 badge: 'bg-emerald-100/90 text-emerald-900 border-emerald-300',
 ground: 'bg-[#1e3e33]',
 pathColor: '#3a6654',
 skyGradient: 'from-teal-100/60 via-emerald-50/40 to-slate-100/20'
 },
 sunset: {
 label: 'دفء الغروب',
 icon: Sunset,
 bg: 'from-orange-100/80 via-amber-50/60 to-rose-100/40',
 text: 'text-orange-950',
 badge: 'bg-orange-100/90 text-orange-900 border-orange-300',
 ground: 'bg-[#2b2d22]',
 pathColor: '#5c4e3b',
 skyGradient: 'from-amber-300/40 via-orange-200/30 to-rose-100/20'
 },
 night: {
 label: 'هدوء الليل',
 icon: Moon,
 bg: 'from-slate-950 via-slate-900 to-teal-950',
 text: 'text-emerald-100',
 badge: 'bg-slate-800/90 text-emerald-200 border-slate-700',
 ground: 'bg-[#0f1f1a]',
 pathColor: '#1c342b',
 skyGradient: 'from-slate-900/90 via-slate-950/80 to-teal-950/70'
 }
 }[timeOfDay];

 const ThemeIcon = skyTheme.icon;

 return (
 <div className="relative w-full rounded-3xl overflow-hidden border border-border-medium shadow-md bg-bg-surface transition-all duration-500">
 
 {/* Top Header Controls inside Garden View */}
 <div className={`flex items-center justify-between p-4 border-b border-border-medium/60 backdrop-blur-md ${skyTheme.bg}`}>
 <div>
 <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
 <span> تقدمك</span>
 <span className="text-xs font-normal text-text-muted">({gardenNodes.length}بذره)</span>
 </h3>
 <p className="text-xs text-text-muted">انقر على أي زهرة أو نبتة لاسترجاع أثر خطوتك</p>
 </div>

 {/* Time of Day Switcher */}
 <div className="flex items-center gap-1 bg-bg-surface/90 p-1 rounded-2xl border border-border-medium/80 shadow-2xs shrink-0">
 {[
 { key: 'morning', label: 'صباح' },
 { key: 'day', label: 'نهار' },
 { key: 'sunset', label: 'غروب' },
 { key: 'night', label: 'ليل' }
 ].map(t => {
 const isActive = timeOfDay === t.key;
 return (
 <button
 type="button"
 key={t.key}
 onClick={() => setTimeOfDay(t.key)}
 className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
 isActive 
 ? 'bg-emerald-700 text-white shadow-2xs' 
 : 'text-text-muted hover:text-text-primary hover:bg-bg-surface-hover'
 }`}
 >
 {t.label}
 </button>
 );
 })}
 </div>
 </div>

 {/* Main Interactive Garden Canvas */}
 <div className={`relative w-full min-h-[360px] sm:min-h-[440px] bg-gradient-to-b ${skyTheme.skyGradient} p-4 sm:p-6 overflow-hidden select-none transition-all duration-700`}>
 
 {/* Sky Ambient Details (Stars at night, soft clouds in day) */}
 {timeOfDay === 'night' && (
 <div className="absolute inset-0 pointer-events-none opacity-40">
 <div className="absolute top-6 left-12 size-1.5 bg-amber-200 rounded-full animate-ping" />
 <div className="absolute top-14 left-1/3 size-1 bg-bg-surface rounded-full animate-pulse" />
 <div className="absolute top-10 right-20 size-2 bg-emerald-200 rounded-full animate-pulse" />
 <div className="absolute top-20 right-1/3 size-1 bg-amber-100 rounded-full animate-ping" />
 </div>
 )}

 {/* Natural Curved Hills & Organic Ground SVG */}
 <div className="absolute inset-0 top-1/4 pointer-events-none">
 <svg className="w-full h-full" viewBox="0 0 1000 500" preserveAspectRatio="none">
 {/* Background Hills */}
 <path d="M0,180 Q250,90 500,160 T1000,140 L1000,500 L0,500 Z" fill={timeOfDay === 'night' ? '#0d221b' : '#2d5a47'} opacity="0.6" />
 {/* Foreground Hills */}
 <path d="M0,230 Q350,150 700,240 T1000,200 L1000,500 L0,500 Z" fill={timeOfDay === 'night' ? '#081712' : '#1e3e33'} />
 
 {/* Stone Winding Pathway */}
 <path 
 d="M100,450 C200,380 300,320 450,330 C600,340 700,260 900,220" 
 fill="none" 
 stroke={skyTheme.pathColor} 
 strokeWidth="24" 
 strokeDasharray="12,12" 
 strokeLinecap="round" 
 opacity="0.8" 
 />

 {/* River Stream (Unlocked if 3+ items exist) */}
 {gardenNodes.length >= 2 && (
 <path 
 d="M-50,320 C200,280 400,380 650,290 C800,230 950,260 1050,200" 
 fill="none" 
 stroke={timeOfDay === 'night' ? '#1e3a5f' : '#38bdf8'} 
 strokeWidth="28" 
 opacity={timeOfDay === 'night' ? '0.5' : '0.45'} 
 strokeLinecap="round" 
 />
 )}
 </svg>
 </div>

 {/* Empty Garden State */}
 {!hasItems && (
 <div className="relative z-10 flex flex-col items-center justify-center min-h-[320px] text-center space-y-4 px-4 py-8">
 {/* Glowing Seed Visual */}
 <div className="relative group cursor-pointer" onClick={() => nav('/modules')}>
 <div className="size-20 sm:size-24 rounded-full bg-emerald-100/80 border-2 border-emerald-300/80 flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-all">
 <div className="size-10 sm:size-12 rounded-full bg-gradient-to-tr from-amber-600 to-emerald-600 flex items-center justify-center text-white shadow-md animate-pulse">
 🌱
 </div>
 </div>
 <div className="absolute -bottom-2 inset-x-0 mx-auto w-16 h-3 bg-slate-900/20 rounded-full blur-xs" />
 </div>

 <div className="max-w-md space-y-1.5 bg-bg-surface/90 backdrop-blur-md p-5 rounded-2xl border border-emerald-200/80 shadow-sm">
 <h4 className="text-lg font-bold text-emerald-950">
 لم تبدأ الحديقة بعد.
 </h4>
 <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-medium">
 كل رحلة تعافٍ وتوازن عظيمة تبدأ بإنبات بذرة صغيرة واحدة. خصص دقيقة واحدة اليوم لقراءة مقال أو إكمال تمرين نفسي قصير.
 </p>

 <button 
 onClick={() => nav('/modules')}
 className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs sm:text-sm hover:bg-emerald-800 active:scale-95 transition-all shadow-sm"
 >
 <span>ازرع أول خطوة الآن</span>
 <ChevronLeft size={16} />
 </button>
 </div>
 </div>
 )}

 {/* Garden Nodes (Plants, Flowers, Trees, Stones) */}
 {hasItems && (
 <div className="relative z-10 w-full h-[320px] sm:h-[380px]">
 {gardenNodes.map((node) => {
 const isSelected = selectedNode?.nodeId === node.nodeId;
 
 return (
 <div
 key={node.nodeId}
 onClick={() => setSelectedNode(node)}
 style={{ left: `${node.x}%`, top: `${node.y}%` }}
 className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 group hover:z-30 ${
 isSelected ? 'scale-125 z-40' : 'hover:scale-110 z-20'
 }`}
 >
 {/* Subtle pulsing halo when selected */}
 {isSelected && (
 <div className="absolute -inset-3 rounded-full bg-emerald-400/30 animate-ping pointer-events-none" />
 )}

 {/* Plant Element SVG Representation */}
 <div className="relative flex flex-col items-center">
 
 {/* Render visual icon based on gardenEffect */}
 {node.effect === 'tree' ? (
 <GardenTreeIcon />
 ) : node.effect === 'flower' ? (
 <GardenFlowerIcon idx={node.idx} />
 ) : node.effect === 'stone' ? (
 <GardenStoneIcon />
 ) : node.effect === 'stream' ? (
 <GardenStreamIcon />
 ) : (
 <GardenSproutIcon />
 )}

 {/* Ground shadow beneath element */}
 <div className="w-8 h-2 bg-slate-950/20 rounded-full blur-[1px] mt-0.5" />

 {/* Tiny label on hover */}
 <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 px-2 py-0.5 rounded-md bg-slate-900/90 text-white text-[10px] font-medium whitespace-nowrap shadow-xs pointer-events-none">
 {node.title || node.label}
 </div>
 </div>
 </div>
 );
 })}
 </div>
 )}

 {/* Selected Node Details Popover Modal */}
 {selectedNode && (
 <div className="absolute inset-x-4 bottom-4 z-50 bg-bg-surface/95 /95 text-text-primary backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-emerald-200/90 shadow-xl max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
 <div className="flex items-start justify-between gap-3 border-b border-border-subtle pb-2.5">
 <div className="flex items-center gap-2.5">
 <div className="size-10 rounded-xl bg-emerald-100 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-lg font-bold shadow-2xs">
 {selectedNode.effect === 'tree' ? '🌳' : selectedNode.effect === 'flower' ? '🌸' : selectedNode.effect === 'stone' ? '🪨' : '🌱'}
 </div>
 <div>
 <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100 px-2 py-0.5 rounded-md">
 {selectedNode.category || 'أثر مرئي في تقدمك'}
 </span>
 <h4 className="text-base font-bold text-text-primary mt-0.5">
 {selectedNode.title || selectedNode.label}
 </h4>
 </div>
 </div>

 <button 
 onClick={() => setSelectedNode(null)} 
 className="p-1.5 rounded-lg text-slate-400 hover:text-text-secondary dark:hover:text-slate-200 hover:bg-bg-surface-hover dark:hover:bg-[#1f382f] transition-all"
 >
 <X size={18} />
 </button>
 </div>

 <div className="py-3 space-y-2 text-xs sm:text-sm text-text-secondary ">
 <p className="leading-relaxed bg-emerald-50/60 p-3 rounded-xl border border-emerald-100/80 text-emerald-950 dark:text-emerald-200 font-medium">
 💬 <span className="font-semibold">أصل هذا الأثر: </span>
 {selectedNode.description || `تفتحت هذه النبتة في تقدمك الشخصية عند إكمال هذه الخطوة في رحلة التعافي.`}
 </p>

 <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
 <span>📅 التاريخ: {new Date(selectedNode.date || Date.now()).toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
 <span className="text-emerald-700 dark:text-emerald-400 font-bold">نمو +1</span>
 </div>
 </div>

 <div className="pt-2 flex justify-end">
 <button
 onClick={() => setSelectedNode(null)}
 className="px-4 py-1.5 rounded-xl bg-bg-surface-hover hover:bg-bg-surface-hover dark:hover:bg-emerald-900 text-text-primary text-xs font-bold transition-all"
 >
 إغلاق
 </button>
 </div>
 </div>
 )}

 </div>
 </div>
 );
}

/* Vector Garden Elements SVG Helpers */
function GardenSproutIcon() {
 return (
 <svg width="28" height="32" viewBox="0 0 28 32" fill="none" className="transform hover:scale-110 transition-transform">
 <path d="M14 28V12" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" />
 <path d="M14 16C18 12 24 12 24 16C24 20 18 20 14 16Z" fill="#22c55e" />
 <path d="M14 18C10 14 4 14 4 18C4 22 10 22 14 18Z" fill="#16a34a" />
 <circle cx="14" cy="12" r="2.5" fill="#fef08a" />
 </svg>
 );
}

function GardenFlowerIcon({ idx }) {
 const colors = ['#f43f5e', '#d946ef', '#a855f7', '#06b6d4', '#f59e0b'];
 const petalColor = colors[idx % colors.length];

 return (
 <svg width="32" height="36" viewBox="0 0 32 36" fill="none" className="transform hover:scale-110 transition-transform">
 <path d="M16 34V16" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
 {/* Petals */}
 <circle cx="16" cy="10" r="6" fill={petalColor} />
 <circle cx="10" cy="14" r="6" fill={petalColor} opacity="0.9" />
 <circle cx="22" cy="14" r="6" fill={petalColor} opacity="0.9" />
 <circle cx="12" cy="20" r="5" fill={petalColor} opacity="0.8" />
 <circle cx="20" cy="20" r="5" fill={petalColor} opacity="0.8" />
 {/* Center */}
 <circle cx="16" cy="15" r="4" fill="#fef08a" />
 </svg>
 );
}

function GardenTreeIcon() {
 return (
 <svg width="38" height="46" viewBox="0 0 38 46" fill="none" className="transform hover:scale-110 transition-transform">
 <path d="M19 44V26" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
 {/* Leaves Canopy */}
 <circle cx="19" cy="16" r="14" fill="#15803d" />
 <circle cx="12" cy="20" r="10" fill="#16a34a" />
 <circle cx="26" cy="20" r="10" fill="#22c55e" />
 <circle cx="19" cy="10" r="8" fill="#4ade80" opacity="0.6" />
 </svg>
 );
}

function GardenStoneIcon() {
 return (
 <svg width="26" height="20" viewBox="0 0 26 20" fill="none">
 <path d="M3 14C3 9 7 4 13 4C19 4 23 8 23 14C23 17 19 18 13 18C7 18 3 17 3 14Z" fill="#64748b" />
 <path d="M6 12C6 9 9 6 13 6C17 6 20 9 20 12" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
 </svg>
 );
}

function GardenStreamIcon() {
 return (
 <svg width="30" height="24" viewBox="0 0 30 24" fill="none">
 <path d="M2 12C8 6 14 18 20 12C26 6 28 12 28 12" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
 <path d="M4 18C10 12 16 22 22 18" stroke="#7dd3fc" strokeWidth="2" strokeLinecap="round" />
 </svg>
 );
}
