// src/components/wellness/FloatingWellnessHub.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Music, 
  FileText, 
  ArrowUp, 
  ArrowDown, 
  X,
  Volume2,
  Sparkles
} from 'lucide-react';
import { useMusic } from '../../contexts/MusicContext';
import FloatingMusicPlayer from './FloatingMusicPlayer';
import FloatingAIChat from './FloatingAIChat';
import StickyNoteOverlay from './StickyNoteOverlay';
import GlobalSearch from './GlobalSearch';
import { useScrollState, scrollToTop, scrollToBottom } from './ScrollControls';

export default function FloatingWellnessHub() {
 const [isOpen, setIsOpen] = useState(false);
 const [activeTool, setActiveTool] = useState(null); // 'music' | 'notes' | 'search' | null
 const { isPlaying, currentTrackData } = useMusic();
 const { canScrollUp, canScrollDown } = useScrollState();
 const hubRef = useRef(null);

 // Keyboard Escape key & Click outside listener
 useEffect(() => {
 const handleKeyDown = (e) => {
 if (e.key === 'Escape') {
 setIsOpen(false);
 setActiveTool(null);
 }
 };

 const handleClickOutside = (e) => {
 if (hubRef.current && !hubRef.current.contains(e.target)) {
 setIsOpen(false);
 }
 };

 document.addEventListener('keydown', handleKeyDown);
 document.addEventListener('mousedown', handleClickOutside);
 document.addEventListener('touchstart', handleClickOutside);

 return () => {
 document.removeEventListener('keydown', handleKeyDown);
 document.removeEventListener('mousedown', handleClickOutside);
 document.removeEventListener('touchstart', handleClickOutside);
 };
 }, []);

 const toggleTool = (tool) => {
 if (activeTool === tool) {
 setActiveTool(null);
 } else {
 setActiveTool(tool);
 setIsOpen(false); // Close menu when tool is opened
 }
 };

  return (
  <div 
    ref={hubRef} 
    className="fixed bottom-20 left-4 sm:bottom-8 sm:left-8 z-50 flex flex-col items-start gap-3 select-none dir-rtl"
  >
    {/* Tool Panels Overlay (Chat, Music, Notes, Search) */}
    {activeTool === 'chat' && (
      <div className="mb-1">
        <FloatingAIChat onClose={() => setActiveTool(null)} />
      </div>
    )}

    {activeTool === 'music' && (
      <div className="mb-1">
        <FloatingMusicPlayer onClose={() => setActiveTool(null)} />
      </div>
    )}

 {activeTool === 'notes' && (
 <div className="mb-1">
 <StickyNoteOverlay onClose={() => setActiveTool(null)} />
 </div>
 )}

 {activeTool === 'search' && (
 <GlobalSearch onClose={() => setActiveTool(null)} />
 )}

 {/* Floating Menu Popover */}
 {isOpen && (
 <div className="flex flex-col gap-2 p-2 bg-slate-900/90 text-white rounded-3xl border border-emerald-500/30 shadow-md backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200">
 
 {/* Chat AI Button */}
 <button
   onClick={() => toggleTool('chat')}
   aria-label="Open Chat AI"
   className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
     activeTool === 'chat' 
       ? 'bg-emerald-600 text-white shadow-md' 
       : 'hover:bg-slate-800 text-slate-200'
   }`}
 >
   <img 
      src="/ChatGPT_Image_Jul_19_2025_06_34_59_PM.svg" 
      alt="AI Logo" 
      className="shrink-0 w-4 h-4 object-contain animate-pulse rounded-full"
      referrerPolicy="no-referrer"
   />
   <span>Chat AI</span>
 </button>

 {/* Search Button */}
 <button
 onClick={() => toggleTool('search')}
 aria-label="Open search"
 className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all ${
 activeTool === 'search' 
 ? 'bg-emerald-500 text-white shadow-md' 
 : 'hover:bg-slate-800 text-slate-200'
 }`}
 >
 <Search size={16} className="shrink-0 text-sky-300" />
 <span> Search </span>
 </button>

 {/* Music Button */}
 <button
 onClick={() => toggleTool('music')}
 aria-label="Open music player"
 className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all ${
 activeTool === 'music' 
 ? 'bg-emerald-500 text-white shadow-md' 
 : 'hover:bg-slate-800 text-slate-200'
 }`}
 >
 <div className="relative shrink-0">
 <Music size={16} className={`shrink-0 ${isPlaying ? 'text-emerald-300 animate-pulse' : ''}`} />
 {isPlaying && (
 <span className="absolute -top-1 -right-1 size-2 rounded-full bg-emerald-400 animate-ping" />
 )}
 </div>
 <span>Music</span>
 {isPlaying && (
 <span className="text-[10px] opacity-75 truncate max-w-[80px] font-normal">
 ({currentTrackData?.title?.split('-')[0] || 'تأمل'})
 </span>
 )}
 </button>

 {/* Notes Button */}
 <button
 onClick={() => toggleTool('notes')}
 aria-label="Open notes"
 className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all ${
 activeTool === 'notes' 
 ? 'bg-emerald-500 text-white shadow-md' 
 : 'hover:bg-slate-800 text-slate-200'
 }`}
 >
 <FileText size={16} className="shrink-0 text-amber-300" />
 <span>Notes</span>
 </button>

 {/* Scroll Up Button */}
 {canScrollUp && (
 <button
 onClick={() => {
 scrollToTop();
 setIsOpen(false);
 }}
 aria-label="Scroll to top"
 className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl text-xs font-bold hover:bg-slate-800 text-slate-300 transition-all"
 >
 <ArrowUp size={16} className="shrink-0 text-emerald-400" />
 <span> Up </span>
 </button>
 )}

 {/* Scroll Down Button */}
 {canScrollDown && (
 <button
 onClick={() => {
 scrollToBottom();
 setIsOpen(false);
 }}
 aria-label="Scroll to bottom"
 className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl text-xs font-bold hover:bg-slate-800 text-slate-300 transition-all"
 >
 <ArrowDown size={16} className="shrink-0 text-emerald-400" />
 <span> Down </span>
 </button>
 )}
 </div>
 )}

 {/* Main Floating Trigger Button */}
 <button
 onClick={() => setIsOpen(!isOpen)}
 aria-label="Open floating wellness hub"
 className={`relative group flex items-center gap-2 px-3.5 py-3 rounded-full border shadow-lg transition-all duration-300 active:scale-95 ${
 isOpen
 ? 'bg-slate-900 border-emerald-400 text-white shadow-emerald-500/20'
 : 'bg-emerald-800/90 hover:bg-emerald-700 text-white border-emerald-400/40 shadow-emerald-900/30 backdrop-blur-md'
 }`}
 >
 {/* Animated indicator pulse if music is active */}
 {isPlaying && !isOpen && (
 <span className="absolute -top-1 -right-1 size-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-bounce" />
 )}

 <div className="size-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
 {isOpen ? (
 <X size={16} className="text-emerald-300 shrink-0" />
 ) : (
 <Search size={16} className="text-emerald-300 shrink-0" />
 )}
 </div>

 <span className="text-xs font-bold tracking-wide hidden sm:inline">
 {isOpen ? 'إغلاق الأدوات' : 'أدوات السكينة'}
 </span>
 </button>

 </div>
 );
}
